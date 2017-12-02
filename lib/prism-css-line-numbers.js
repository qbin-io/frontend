(function(){
	Prism.hooks.add('complete', function(env) {
        env.element.innerHTML = env.element.innerHTML.replace(/^/gm, "<span class='line-number'></span>");
	});
})();
