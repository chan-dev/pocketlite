# Stage 1: compile client app
FROM node:14-alpine as client-build-step
WORKDIR /app/client
COPY ./client/package*.json /app/client/
COPY ./shared /app/shared
RUN npm install -g @angular/cli@latest
RUN npm install
COPY ./client /app/client
RUN npm run build:prod


# Stage 2: build server
FROM node:14-alpine as server-build-step
WORKDIR /app/server
RUN mkdir -p /app/server
RUN mkdir -p /app/shared
COPY ./server/package.json /app/server/package.json
RUN npm install

COPY ./server /app/server
COPY ./shared /app/shared
# this would create the build files under /app/server/build
RUN npm run build --prod

# Stage 3: create production-ready server
FROM node:14-alpine as server-production
WORKDIR /app
# NOTE:
# the destination path for production files should match the
# root path of _moduleAliases path in package.json
# In this case we're copying all production files to "build" directory
# under "/app" so the _moduleAliases should have a root directory of
# "build"
# "build" -> "build/dir1/dir2"
COPY --from=server-build-step /app/server/build /app/build
COPY ./server/package.json /app/package.json
RUN npm install --only=prod

# Final stage: combine all, move client app inside server
FROM node:14-alpine
WORKDIR /app
COPY --from=server-production /app/package*.json /app/
RUN npm install --only prod
COPY --from=server-production /app/build /app/build/
COPY --from=client-build-step /app/client/dist/pocketlite /app/build/server/client/dist/pocketlite
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
