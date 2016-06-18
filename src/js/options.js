$(document).ready(function(){
    app.init();
});
var app = {    
    init: function(){
        app.loadValues();
        app.submit();
        $('.add-set').on('click', function(){
            app.addSet(); 
        });
        $('.sets').on('click', function(el){
            $('.sets input').removeClass('highlighted');
            $($(el.target).parents('.set')[0]).find('input').addClass('highlighted');
        });
        $('a').on('click', function(e){
            e.preventDefault();
            chrome.tabs.create({ url: $(this).attr('href') });
        });
    },    
    loadValues: function(){
        chrome.storage.sync.get(null, function (obj) {
            
            if(!obj.data){
                $('.sets').append(app.templates.set('', ''));
            }
            
            $(obj.data).each(function(i,v) {
                if(v.email !== '' && v.url !== ''){
                    $('.sets').append(app.templates.set(v.email, v.url));
                }
            });
            
        });  
    },   
    addSet: function(){
        $('.sets').append(app.templates.set('', ''));
    },   
    chrome: {    
        /**
        * Save
        * Writes data with Chrome's storage API
        * obj Object of {name: 'field name', value: 'field value'}
        */
        save: function(obj){
            $(obj).each(function(i,v) {
                chrome.storage.sync.set(obj);
            });
        }      
    },        
    submit: function(){        
        /**
        * Submit
        * Saves form data with Chrome's storage API on submission
        */       
        $('form').on('submit', function(e){
            e.preventDefault;           
            var sets = [];
            $('.set').each(function(i,v) {
                if($(v).find('input[class="email"]').val() !== '' && 
                    $(v).find('input[class="url"]').val() !== '' &&
                    typeof($(v).find('input[class="email"]').val()) !== 'undefined' && 
                    typeof($(v).find('input[class="url"]').val()) !== 'undefined'){
                    sets.push({
                        'email': $(v).find('input[class="email"]').val(),
                        'url': $(v).find('input[class="url"]').val()
                    }); 
                }
            });         
            app.chrome.save({'data': sets});           
            $('.status').html('Saved').fadeIn(300).fadeOut(3000);
        });
    },
    templates: {
        /*
        * Set
        * Email and URL input fields
        */
        set: function(email, url){
            return '<div class="set"><input type="email" value="' + email + '" placeholder="Email address" class="email"><input type="url" value="' + url + '" placeholder="Url of signature (https:// only)" class="url"></div>';
        }
    }
};