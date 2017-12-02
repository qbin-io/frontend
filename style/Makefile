stylus:
	stylus -m -o .. style.styl style-input.styl style-markdown.styl

watch:
	@echo stylus -w -m -o .. style.styl style-input.styl style-markdown.styl
	@trap 'exit 0' INT; stylus -w -m -o .. style.styl style-input.styl style-markdown.styl || exit 0
