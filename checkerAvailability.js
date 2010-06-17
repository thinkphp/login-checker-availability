var checkerUsername = new Class({
        
       /* implements */
       Implements:[Options,Events],

       /* options */
       options: {
           trigger: 'keyup',
           offset: {x: 0,y: 0},
           minLength : 5,
           availableClass: 'available',
           takenClass: 'taken',
           availableImage: '',
           loading:'', 
           takenImage: '',
           url: ''   
       },

       /* constructor of class - initialize */
       initialize: function(element,options) {

          //set options
          this.setOptions(options);

          //grab element
          this.element = document.id(element);

          //get value of the element
          this.lastValue = this.element.value;

          //set up cache data object
          this.cache = {};

          //get coordinates
          var pos = this.element.getCoordinates();

          //set up an image with attribute 'src' and some styles and inject it to the document.body
          this.image = new Element('img',{
                src: '', 
                styles: {
                    'z-index': 10000,
                    position: 'absolute',
                    top: pos.top + this.options.offset.y,
                    left: pos.left + pos.width + this.options.offset.x 
                } 
          }).inject(document.body);
           
          this.setLoader = function(){
               this.image.set('src',this.options.loading);
            return this;
          };

          this.removeLoader = function() {
               this.image.set('src','');
            return this;   
          }

          this.remover = function() {
               this.element.removeClass(this.options.availableClass).removeClass(this.options.takenClass);
            return this;
          };

          this.validate = function(resp) {
                this.cache[this.element.value] = resp;
                this.remover();
                var state = (resp == '1') ? 'available' : 'taken';
                this.element.addClass(this.options[state+'Class']);
                this.image.set('src',this.options[state+'Image']);
            return state;  
          }  


          //set up a request AJAX
          this.request = new Request({
                url: this.options.url,
                method: 'get',
                link: 'cancel',
                onRequest: function(){this.setLoader();this.remover();}.bind(this),
                onComplete: this.validate.bind(this)
          }); 


          //attach listener for this element
          this.element.addEvent(this.options.trigger,function(){

               //if we have a span then deleted
               if($('warninglength')){$('warninglength').dispose();} 

               //get value from element
               var value = this.element.value;

               //if lenght of the value is <= than desired length passed initialize then begin
               if(value.length <= this.options.minLength){
 
                  //keep out last value
                  this.lastValue = value;

                  //remove loader
                  this.removeLoader();

                  //remove class style
                  this.remover();

                  //create new span element with its attributes and inject it into document.body, then exit;
                  new Element('span',{id:'warninglength',
                                      styles:{
                                         position: 'absolute',
                                         left: pos.left + pos.width + this.options.offset.x,
                                         top: pos.top + 5
                                      },
                                      html: '<strong>Error:</strong> your username must be between 4 and 30'
                  }).inject(document.body);

                  return; 
               } 

               /*
                 If the current value is different 
                 from the last value then last value hold current value
                 and we can test if there is in actual cache object otherwise 
                 make AJAX request lookup database
               */                     
               if(value != this.lastValue) {
                     this.check(this.lastValue = value);
               }
                
          }.bind(this));  

       },

       check: function(value){

         //the function check is invoked when the lookup is checked
         this.fireEvent('check');

         //if we have the value in cache object then grab there
         if(this.cache[value] != undefined) {
           return this.validate(this.cache[value]);
 
         //otherwise we make an AJAX request for lookup database
         } else {
           //send the request
           return this.request.send('username='+value+'&ajax=1');
         } 
         //return object
         return this;   
       }   

});//end class checkerUsername