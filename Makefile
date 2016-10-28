publish:
	npm run build
	npm publish

publish-sync: publish
	cnpm sync war-http
	tnpm sync war-http
