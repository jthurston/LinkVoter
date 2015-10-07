Links = new Meteor.Collection("links");

if (Meteor.isClient) {

  Template.header.collection_size = function () {
    return Links.find({}).count();
  };


  Template.link_list.links = function () {
    return Links.find({}, {sort : {score: -1} });
  };


  Template.link_detail.events = {

    'click input.thumbs_up' : function () {
      Meteor.call('vote', this.url, 'thumbs_up');
    },

    'click input.thumbs_down' : function () {
      Meteor.call('vote', this.url, 'thumbs_down');
    }

  };

  Template.add_new_link.events = {

    'click input#add_url' : function () {

      var new_url = $('#url').val();

      var url_row = Links.findOne( {url:new_url} );

      if(!url_row){

        Links.insert( { url : new_url,
                        score: 0,
                        thumbs_up: 0,
                        thumbs_down: 0 });
      }
      Meteor.call('vote', url, 'thumbs_up');
    }
  };

  Template.change_settings.events = {
    'click input#clear_urls' : function () {
      Meteor.call('removeAllPosts')
    }
  };
}

if (Meteor.isServer) {
    Meteor.startup(function () {
      Meteor.methods({
        vote: function (url, field){

                new_obj = { $inc: { } };

                if(field =='thumbs_up'){
                  new_obj.$inc['thumbs_up'] = 1;
                  new_obj.$inc['score'] = 1;
                }else{
                  new_obj.$inc['thumbs_down'] = 1;
                  new_obj.$inc['score'] = -1;
                }

                Links.update( { url : url }, new_obj );

              },

        removeAllPosts: function() {
          Links.remove({});
        }
      });
    });
}
