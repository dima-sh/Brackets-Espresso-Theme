define(function(require, exports, module) {
	var fileInfo = {};

	function addIcon(extension, icon, color, size) {
		fileInfo[extension] = {
			icon: icon,
			color: color,
			size: size
		};
	}
	function addAlias(extension, other) {
		fileInfo[extension] = fileInfo[other];
	}

	// XML
	addIcon('xml',    '<span class="doc-xml"> </span>', '#ff6600');
	addIcon('html',   '<span class="doc-html"> </span>', '#E34C26');
	addAlias('htm',  'html');
	addAlias('svg',  'xml');
	addAlias('xsl',  'xml');

	// Stylesheets
	//addIcon('css',    '\uf219', '#4396cc', 11);
	addIcon('css',    '<span class="doc-css"> </span>', '#4396cc', 11);

	addIcon('scss',   '<span class="doc-scss"> </span>', '#c6538c', 11);
	addAlias('sass',  'scss');
	addAlias('less',  'scss');
	addAlias('styl',  'scss');

	// JavaScript
	addIcon('js',     '<span class="doc-js"> </span>', '#e57c28');
	addAlias('ts',   'js');
	addAlias('coffee',  'js');
	addAlias('json',  'js');

	// Server side
	addIcon('php',    '<span class="doc-php"> </span>', '#6976c3');

	// Java
	addIcon('java',   '\uf272', '#5382A1');
	addAlias('class', 'java');

	// Shell
	addIcon('sh',     '\uf12e', '#008d00');

	// Images
	addIcon('png',    '<span class="doc-img"> </span>', '#97C582');
	addAlias('jpg',   'png');
	addAlias('jpeg',  'png');
	addAlias('tiff',  'png');
    addAlias('gif',  'png');

	// Videos
	addIcon('mp4',    '\uf1f3', '#008d00');
	addAlias('webm',  'mp4');
	addAlias('ogg',   'mp4');

	// Audio
	addIcon('mp3',    '\uf259', '#921100');
	addAlias('wav',   'mp3');

	addIcon('htaccess',     '<span class="doc-htaccess"> </span>', '#008d00');
    addAlias('gitignore',   'htaccess');

	var def = {
		color: '#fff',
		icon: '<span class="generic"> </span>'
	};

	var ProjectManager = brackets.getModule('project/ProjectManager');
	var DocumentManager = brackets.getModule('document/DocumentManager');
	var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

	ExtensionUtils.loadStyleSheet(module, "styles/style.css");
    ExtensionUtils.loadStyleSheet(module, "styles/espresso.css");

	function renderFiles() {
		$('#project-files-container ul').removeClass('jstree-no-icons').addClass('jstree-icons');

		var $items = $('#project-files-container li>a');

		$items.each(function(index) {
			var ext = ($(this).find('.extension').text() || '').substr(1);

			var data;

			if ($(this).parent().hasClass('jstree-leaf')) {
				data = fileInfo.hasOwnProperty(ext) ? fileInfo[ext] : def;
			} else {
				return;
			}

			var $new = $(this).find('.jstree-icon');
			$new.html(data.icon);
			$new.addClass('file-icon');
			$new.css({
				color: data.color,
				fontSize: (data.size || 16) + 'px'
			});
		});
	}
	function renderWorkingSet() {
		$('#open-files-container li>a>.file-icon').remove();

		var $items = $('#open-files-container li>a');

		$items.each(function(index) {
			var ext = ($(this).find('.extension').text() || '').substr(1);

			var data = fileInfo.hasOwnProperty(ext) ? fileInfo[ext] : def;

			var $new = $('<div>');
			$new.html(data.icon);
			$new.addClass('file-icon');
			$new.css({
				color: data.color,
				fontSize: (data.size || 16) + 'px'
			});
			$(this).prepend($new);
		});
	}

	$(ProjectManager).on('projectOpen projectRefresh', function() {
		var events = 'load_node.jstree create_node.jstree set_text.jstree';

		renderFiles();

		$('#project-files-container').off(events, renderFiles);
		$('#project-files-container').on(events, renderFiles);
	});

	$(DocumentManager).on("workingSetAdd workingSetAddList workingSetRemove workingSetRemoveList fileNameChange pathDeleted", function() { // TODO: workingSetSort ?
		renderWorkingSet();
	});
});
