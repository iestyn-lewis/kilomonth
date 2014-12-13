$(function() {
    Framework.init(function() { 
        ViewUser.bind();
        ViewUser.setModel(km.authenticatedUser);
        ViewUser.toCtls();
    });
});
