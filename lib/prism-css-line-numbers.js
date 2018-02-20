(function(){
	Prism.hooks.add('complete', function(env) {
        env.element.innerHTML = env.element.innerHTML.replace(/<span class=['"]line-number['"]><\/span>/g, "").replace(/^/gm, "<span class='line-number'></span>");
	});
})();
