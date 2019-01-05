function publish
    yarn build
    scp -r dist jnj:/www/jjpodcastweb/docs
end
