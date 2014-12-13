$(function() {
    Framework.init(function() {
        PublicMaps.init();
        ViewPublicMaps.init();
        ViewPublicMaps.bind();
        PublicMaps.getAll(function(maps) {
            ViewPublicMaps.setModel(maps);
            ViewPublicMaps.toCtls();
        });
    });
});
