'use strict'

var mongoose = require('mongoose'),
    Scotch = mongoose.model('Scotch');

exports.createScotch = function(req, res) {
    var scotch = new Scotch();
    
    var values = req.body;
    scotch.name = values.name;
    scotch.lcboLink = values.lcboLink;
    scotch.price = values.price;
    scotch.imgLink = values.imgLink;

    scotch.save( function(err) {
        if(err)
            res.send(err);

        //req.flash('createScotch', 'Scotch created successfully!');
        res.redirect('/');
    });
}

exports.getAllScotch = function(req, res) {
    console.log("ScotchesController.getAllScotch called!");
    Scotch.find(function(err, entries) {
        console.log("ScotchesController.getAllScotch.Find called!");
        if(err)
            res.send(err);
        
        res.json(entries);
    });
}

// exports.getCategoryById = function(req,res) {
//     Category.findById(req.params.category_id, function(err, category) {
//         if(err)
//             res.send(err);
        
//         res.json(category);
//     });
// }

// exports.updateCategoryById = function(req, res) {
//     Category.findById(req.params.category_id, function(err, category) {
//         if(err)
//             res.send(err);
        
//         //Update the entry
//         var values = req.body;
//         for(var name in values)
//         {
//             category[name] = values[name];
//         }

//         // Save the entry
//         category.save(function(err) {
//             if(err)
//                 res.send(err);
//             res.json({message: 'Category Updated!'});
//         });
//     });
// }

exports.deleteCategory = function(req, res) {
    Scotch.remove({
        _id: req.params._id
    }, function(err, scotch) {
        if(err)
            res.send(err);

        res.json({message: 'Scotch successfully deleted.'});
    });
}