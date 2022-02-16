if test -z $1 ; then 
    echo "The arg is empty"
    echo $1
    RUN npm run build

    FROM nginx
    EXPOSE 3000
    COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
    COPY --from=buildphase /app/public /usr/share/nginx/html
else 
    echo "The arg is not empty: $1"
    CMD ["npm", "start"]
fi