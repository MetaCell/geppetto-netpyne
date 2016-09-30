/*******************************************************************************
 *
 * Copyright (c) 2011, 2016 OpenWorm.
 * http://openworm.org
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the MIT License
 * which accompanies this distribution, and is available at
 * http://opensource.org/licenses/MIT
 *
 * Contributors:
 *      OpenWorm - http://openworm.org/people.html
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 *******************************************************************************/



define(function (require) {
	return function (GEPPETTO) {
		
	    var link = document.createElement("link");
	    link.type = "text/css";
	    link.rel = "stylesheet";
	    link.href = "geppetto/extensions/geppetto-neuron/css/material.css";

	    document.getElementsByTagName("head")[0].appendChild(link);
	    
		//Logo initialization 
		GEPPETTO.ComponentFactory.addComponent('LOGO', {logo: 'gpt-gpt_logo'}, document.getElementById("geppettologo"));

		
		//Loading spinner initialization
		GEPPETTO.on('show_spinner', function(label) {
			GEPPETTO.ComponentFactory.addSpinner({show : true, keyboard : false, text: label, logo: "gpt-gpt_logo"}, document.getElementById("modal-region"));	
		});
		

		$("#github").hide();
		$("#sim").css("background-color","#3e2723");

        GEPPETTO.ComponentFactory.addComponent('PYTHONCONSOLE', {pythonNotebookPath: "http://localhost:8888/notebooks/code/geppetto-luna-code/org.geppetto.python/jupyter-frontend/geppetto_demo.ipynb"}, document.getElementById("pythonConsole"));
		
		require('components/jupyter/GeppettoJupyter');
		
		GEPPETTO.G.setIdleTimeOut(-1);


	};
});