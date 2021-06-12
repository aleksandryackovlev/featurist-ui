FROM node:14

WORKDIR /var/lib/api-service

COPY tools/api-service-mock/package.json tools/api-service-mock/yarn.lock ./

RUN yarn install

COPY ./tools/api-service-mock/ ./

EXPOSE 8004

CMD [ "node", "index.js" ]
