(function(){
	Prism.hooks.add('before-insert', function (env) {
        env.highlightedCode = env.highlightedCode.replace(/^|(\n)/g, "$1<span class='line-number'></span>");
	});
})();
