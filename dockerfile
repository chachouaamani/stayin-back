FROM node:latest
WORKDIR /app
COPY api /app
RUN npm install
EXPOSE 8800
CMD ["node", "index.js"]
