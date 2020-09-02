import puppeteer from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import DOMPurify from 'isomorphic-dompurify';
// @ts-ignore
import { Readability } from '@mozilla/readability';
// @ts-ignore
import * as turndownPluginGfm from 'turndown-plugin-gfm';

import { Bookmark } from '@models/bookmark.model';

const extractDomain = (uri: string) => {
  if (!uri) {
    return;
  }
  return new URL(uri).hostname.replace('www.', '');
};

/**
 * 1. first search for metadata related to images
 * 2. search for image in link[rel="image_src"]
 * 3. get the first image that matches the aspect ration defined OR is not an
 *    icon image
 * 4. lastly, if it is a relative url, then convert it to absolute url by
 * prefixing it with the site's domain
 */
const getImg = async (page: any, uri: string) => {
  const img: string | null = await page.evaluate(async () => {
    const ogImg: HTMLMetaElement | null = document.querySelector(
      'meta[property="og:image"]'
    );
    if (ogImg?.content?.length) {
      return ogImg.content;
    }
    const imgRelLink: HTMLLinkElement | null = document.querySelector(
      'link[rel="image_src"]'
    );
    if (imgRelLink?.href?.length) {
      return imgRelLink.href;
    }
    const twitterImg: HTMLMetaElement | null = document.querySelector(
      'meta[name="twitter:image"]'
    );
    if (twitterImg?.content?.length) {
      return twitterImg.content;
    }

    let imgs = Array.from(document.getElementsByTagName('img'));
    if (imgs.length > 0) {
      imgs = imgs.filter(img => {
        let addImg = true;
        if (img.naturalWidth > img.naturalHeight) {
          if (img.naturalWidth / img.naturalHeight > 3) {
            addImg = false;
          }
        } else if (img.naturalHeight / img.naturalWidth > 3) {
          addImg = false;
        }
        if (img.naturalHeight <= 50 || img.naturalWidth <= 50) {
          addImg = false;
        }
        return addImg;
      });

      if (imgs.length > 0) {
        const imgSources: string[] = imgs.map(img => {
          return img.src.indexOf('//') === -1
            ? new URL(uri).origin + img.src
            : img.src;
        });
        return imgSources[0];
      }
    }
    return null;
  });
  return img;
};

/**
 * 1. first search for metadata related to title
 * 2. search for document.title
 * 3. search for the first h1
 * 4. lastly search for the first h2
 */
const getTitle = async (page: any) => {
  const title: string | null = await page.evaluate(() => {
    const ogTitle: HTMLMetaElement | null = document.querySelector(
      'meta[property="og:title"]'
    );
    if (ogTitle?.content?.length) {
      return ogTitle.content;
    }
    const twitterTitle: HTMLMetaElement | null = document.querySelector(
      'meta[name="twitter:title"]'
    );
    if (twitterTitle?.content?.length) {
      return twitterTitle.content;
    }
    const docTitle: string = document.title;
    if (docTitle) {
      return docTitle;
    }
    const h1: HTMLHeadingElement | null = document.querySelector('h1');
    if (h1) {
      return h1.innerHTML;
    }
    const h2: HTMLHeadingElement | null = document.querySelector('h2');
    if (h2) {
      return h2.innerHTML;
    }
    return null;
  });
  return title;
};

const getDescription = async (page: any) => {
  const description: string | null = await page.evaluate(() => {
    const ogDescription: HTMLMetaElement | null = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription?.content?.length) {
      return ogDescription.content;
    }
    const twitterDescription: HTMLMetaElement | null = document.querySelector(
      'meta[name="twitter:description"]'
    );
    if (twitterDescription?.content?.length) {
      return twitterDescription.content;
    }
    const metaDescription: HTMLMetaElement | null = document.querySelector(
      'meta[name="description"]'
    );
    if (
      metaDescription &&
      metaDescription.content &&
      metaDescription.content.length
    ) {
      return metaDescription.content;
    }

    const paragraphs: HTMLParagraphElement[] = Array.from(
      document.querySelectorAll('p')
    );
    let par = null;

    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    // return null if element or it's ancenstor has a display set to none
    par =
      paragraphs &&
      paragraphs.find((p: HTMLParagraphElement) => {
        return p.offsetParent !== null;
      });

    // NOTE: we just get the text nodes to keep it safe from XSS injections
    return par && par.innerText;
  });
  return description;
};

const getOgType = async (page: any, uri: string) => {
  const type: string | null = await page.evaluate(() => {
    const ogType: HTMLMetaElement | null = document.querySelector(
      'meta[property="og:type"]'
    );
    if (ogType?.content?.length) {
      return ogType.content;
    }
    return null;
  });
  return type;
};

const getCanonicalUrl = async (page: any, uri: string) => {
  const href: string | null = await page.evaluate(() => {
    const ogType: HTMLLinkElement | null = document.querySelector(
      'link[rel="canonical"]'
    );
    if (ogType?.href?.length) {
      return ogType.href;
    }
    return null;
  });
  return href;
};

// TODO: move puppeteer.use calls
// make sure it's only invoked once
const scrapeLink = async (
  uri: string,
  puppeteerArgs = [],
  puppeteerAgent = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
) => {
  puppeteer.use(pluginStealth());

  const browser = await puppeteer.launch({
    headless: true,
    args: [...puppeteerArgs],
  });
  const page = await browser.newPage();
  page.setUserAgent(puppeteerAgent);
  await page.setRequestInterception(true);

  let followsRedirect = false;
  // @ts-ignore
  /* page.on('console', (msg: any) => console[msg._type]('PAGE LOG:', msg._text)); */
  page.on('request', request => {
    if (request.isNavigationRequest() && request.redirectChain().length) {
      followsRedirect = true;
    }
    if (request.url().endsWith('.png') || request.url().endsWith('.jpg')) {
      request.abort();
    } else {
      request.continue();
    }
  });

  const response = await page.goto(uri, {
    waitUntil: 'networkidle2',
  });

  // get the serialized version of DOM including the DocType
  // because @moz/readability requires it
  const docString = await page.evaluate(() => {
    // we have to stringify the document in this way because it
    // returns an circular error using JSON.stringify
    const docString =
      new XMLSerializer().serializeToString(document.doctype as any) +
      document.documentElement.outerHTML;

    // we can't just return the document object here because
    // puppeteer calls JSON.stringify in the background when passing the
    // document object to `page.exposeFunction`
    // so we have to pass the stringified version of document here
    // const article = window.getReadability(docString);
    return docString;
  });

  const doc = new JSDOM(docString, {
    // TODO: rename uri to url
    url: uri,
  });
  const article = new Readability(doc.window.document).parse();

  const [title, description, image, type, canonicalUrl] = await Promise.all([
    getTitle(page),
    getDescription(page),
    getImg(page, uri),
    getOgType(page, uri),
    getCanonicalUrl(page, uri),
  ]);

  // TODO: convert to markdown
  const turndownService = new TurndownService();
  turndownService.use(turndownPluginGfm.gfm);

  let contentInMarkdown = '';
  if (type === 'article' && (!followsRedirect || !canonicalUrl)) {
    const cleanMarkup = DOMPurify.sanitize(article.content);
    contentInMarkdown = turndownService.turndown(cleanMarkup);
  }

  const obj: Partial<Bookmark> = {
    title: title || '',
    description: description || '',
    url: uri || '',
    domain: extractDomain(uri),
    canonicalUrl: canonicalUrl || '',
    image: image || '',
    contentInMarkdown,
    type: type || '',
    followsRedirect,
  };

  await browser.close();

  return obj;
};

export default scrapeLink;
