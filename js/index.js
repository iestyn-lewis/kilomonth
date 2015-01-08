$(function() {
    Framework.init(function() { 
        ViewUser.bind();
        ViewUser.setModel(km.authenticatedUser);
        ViewUser.toCtls();
        
        $("#start-name").focus();
        
        for (i = new Date().getFullYear(); i > 1900; i--)
        {
            $('#start-year').append($('<option />').val(i).html(i));
        }
        
        $("#btnGetStarted").click(function() {
            var name = $("#start-name").val();
            var year = $("#start-year").val();
            var month = $("#start-month").val();
            var url = "/kilomonth.html?mapid=_temp&name=" + name + "&year=" + year + "&month=" + month;
            window.location.href = url;
        });
    });
});
