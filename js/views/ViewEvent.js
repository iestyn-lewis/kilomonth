var ViewEvent = {
    init : function() {},
    bind : function() {
        this.$dialog = $("#addModal");
        this.$eventName = $("#add-eventName");
        this.$color = $("#add-color");
        this.$monthStart = $("#add-month");
        this.$yearStart = $("#add-year");
        this.$monthEnd = $("#add-end-month");
        this.$yearEnd = $("#add-end-year");
        this.$layer = $("#selectLayer");
        this.$description = $("#descEdit");
        
        this.$btnDelete = $("#add-delete");
        this.$btnSave = $("#add-save");
        
        document.getElementById('files').addEventListener('change', this.handleFileSelect, false);
        
        // layers
        var layers = km.layers.layers;
        for (var layer in layers) {
            if (layers.hasOwnProperty(layer)) {
                $("#selectLayer").append('<option value="' + layer + '">' + layers[layer].displayName + '</option>');
            }
        }
        
        $("#add-color").colorPicker({showHexField: false});
        $('#descEdit').summernote({
           toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']]
          ]
        });       
        
        $('#addModal').on('shown.bs.modal', function () {
            $('#add-eventName').focus();
        });
        
        this.$btnSave.click(function() {
            this.fromCtls();
            this.save();
        }.bind(this));
        
        this.$btnDelete.click(function() {
            this.handleDelete();
            this.save();
        }.bind(this));
                
        // TODO, get rid of these
        $("#add-color-col").addClass("col-xs-12");
        $("#add-color-col").removeClass("col-xs-6");
        $("#add-on-top-col").hide();
    },
    
    setModel : function(lmd, model) {
        this.lifeMapData = lmd;
        this.event = model;
    },
    
    showDialog : function() {
        this.toCtls();
        this.$dialog.modal();
    },
    
    toCtls : function() {
        $("#list").html("");
        $("#existingImages").html("");
        $("#files").val(null);
        $("#saveIndicator").hide();
        $("#saveButtons").show();
        if (this.event.name == "_new") {
            var month = this.event.eventDate.getMonth() + 1;
            var year = this.event.eventDate.getFullYear();
            $("#add-existing-events").hide();
            $("#add-delete").hide();
            $("#add-eventName").val("");
            $("#add-month").val(month);
            $("#add-year").val(year);
            $("#add-end-month").val(month);
            $("#add-end-year").val(year);
            $("#descEdit").code(null);   
        } else {
            var event = this.event;
            $("#add-existing-events").show();
            var month = event.dates[0].getMonth() + 1;
            var year = event.dates[0].getFullYear();
            var month2 = event.dates[1].getMonth() + 1;
            var year2 = event.dates[1].getFullYear();
            var layer = event.layer || 'none';
            $("#add-color").val(event.color);
            $("#add-color").change();
            $("#add-month").val(month);
            $("#add-year").val(year);
            $("#add-end-month").val(month2);
            $("#add-end-year").val(year2);
            $("#add-eventName").val(event.name);
            $("#selectLayer").val(layer);
            $("#add-delete").show();
            $("#add-form-label").text('Edit Event');
            $("#add-delete").show();
            $("#descEdit").code(event.description || null);
            if (event.images) {
                for (var i = 0, image; image = event.images[i]; i++) {  
                    $("#existingImages").append('<div style="float: left;"><a href="#" id="' + image + '" class="delete-image">&#10006;</a><a data-lightbox="images" href="' + image + '.jpg">' + 
                                                '<img width="400px"  src="' + image + '.jpg">' +
                                                '</a></div>');
                }
                $(".delete-image").click(function(evt) {
                    console.log(evt.target);
                    var imageid = evt.target.id;
                    var lmdEvt = this.lifeMapData.eventByEvent(this.event);
                    var images = lmdEvt.images;
                    for(var i=0, image; image = images[i]; i++) {
                        if (image == imageid) {
                            images.splice(i,1);
                            $(evt.target).parent().hide();
                            break;
                        }
                    }
                }.bind(this));
            }
        }
    },
    
    fromCtls : function() {
        var eventName = $("#add-eventName").val();
        var month = $("#add-month option:selected").text();
        var year = $("#add-year option:selected").text();
        var end_month = $("#add-end-month option:selected").text();
        var end_year = $("#add-end-year option:selected").text();
        var layer = $("#selectLayer option:selected").val();
        var color = $("#add-color").val();
        var description = $("#descEdit").code();
        var eventBeingEdited = this.event;
        if (eventBeingEdited.name == "_new") {
            var newEvent = {name: eventName, dates: [month + " 1, " + year, end_month + " 1, " + end_year], style: "fill", color: color, layer: layer, description: description};
            console.log(newEvent);
            this.lifeMapData.data.ranges.push(newEvent);
        } else {
            var evt = this.lifeMapData.eventByEvent(eventBeingEdited);
            evt.name = eventName;
            evt.dates = [month + " 1, " + year, end_month + " 1, " + end_year];
            evt.style = "fill";
            evt.color = color;
            evt.description = description;
            evt.layer = layer;
        }
    },
    
    handleFileSelect : function(evt) {
        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    // Render thumbnail.
                    var span = document.createElement('span');
                    span.innerHTML = ['<img class="thumb" src="', e.target.result,
                                      '" title="', escape(theFile.name), '"/>'].join('');
                    document.getElementById('list').insertBefore(span, null);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    },
        
    handleDelete : function() {
        var eventBeingEdited = this.event;
        console.log('delete' + eventBeingEdited.name);
        var lifeMapData = this.lifeMapData.data;
        for (var i = lifeMapData.ranges.length-1; i >= 0; i--) {
            if (lifeMapData.ranges[i].name == eventBeingEdited.name) {
                lifeMapData.ranges.splice(i, 1);
                break;
            }
        }
    },
    
    save : function() {
        // store new images
        var files = $("#files").prop("files");
        if (files.length > 0) {
             var filesLeft = files.length;
             $("#saveButtons").hide();
             $("#saveIndicator").show();
             for (var i = 0, file; file = files[i]; i++) {   
                var file = files[0];
                var reader = new FileReader();
                var me = this;
                var eventBeingEdited = this.event;
                var lmdEvt = this.lifeMapData.eventByEvent(eventBeingEdited);
                lmdEvt.images = lmdEvt.images || [];
                reader.onload = function(evt) {
                    var data = evt.target.result.split(',')[1];
                    StorageImgur.storeImage(data, function(url) {
                        filesLeft--;
                        lmdEvt.images.push(url);
                        console.log(url);
                        if (filesLeft <= 0) {
                            me.lifeMapData.save();
                            $("#saveIndicator").hide();
                            $("#saveButtons").show();
                            $("#addModal").modal('hide');
                        }
                    });
                };
                reader.readAsDataURL(file);
            }            
        } else {
            // delete old images
            this.lifeMapData.save();
            $("#addModal").modal('hide');
        }
    }
};