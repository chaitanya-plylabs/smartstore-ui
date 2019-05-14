FROM node:8.16.0
ENV LANDING_UX_BUILD  /usr/local/smartstore-ux/dist
RUN mkdir -p ${LANDING_UX_BUILD}
COPY ./dist/spa-mat  ${LANDING_UX_BUILD}
RUN npm install -g http-server
EXPOSE 8080
ENTRYPOINT exec /usr/local/bin/http-server ${LANDING_UX_BUILD} -p 8080
