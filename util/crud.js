module.exports = {
    create: async (res, doc) => {
        try {
            const newDoc = await doc.save();

            res.status(201).send({
                response: 'Document successfully Saved!',
                data: newDoc
            });
        }catch(err) {
            res.status(409).send({
                error: err.name,
                message: err.message
            });
        }
    },
    createAndPush: async(res, doc, model, query, updateKey) => {
        try {
            const newDoc = await doc.save();

            const update = { $push: { [updateKey]: newDoc._id } };
            const updateResult = await model.updateOne(
                query,
                update
            );

            res.status(201).send({
                response: 'Successfully created and pushed document!',
                data: {
                    ...newDoc,
                    ...updateResult
                }
            });        
        }catch(err) {
            console.log(err);
            res.status(409).send({
                error: err.name,
                message: err.message
            });
        }
    },
    update: async(res, model, query, update) => {
        try {
            const updateResult = await model.updateOne(
                query,
                update
            );

            res.status(200).send({
                response: 'Document successfully Updated!',
                data: updateResult
            });
        }catch(err) {
            res.status(401).send({
                error: err.name,
                message: err.message
            });
        }
    },
    // Set selection to null to return all values
    findAndPopulate: async(res, model, id, property, selection) => {
        try {
            // console.log('Find and Populate----------------')
            const population = await model.findById(id)
                .select(selection)
                .populate(property, ((err, population) => {
                    if(err) throw new Error("Cannot populate document");

                    return population
                }));

                // console.log(population)

            res.status(200).send({
                response: 'Successfully populated document!',
                data: population
            });
        }catch(err) {
            console.log('Find and Populate error');
            res.status(401).send({
                error: err.name,
                message: err.message
            });
        }
    },
    findAll: async (res, model) => {
        try{
            const allDocs = await model.find({});

            res.status(200).send({
                data: allDocs
            });
        }catch(err) {
            console.log(err);
            res.status(401).send({
                err
            });
        }
    },
    delete: async (res, model, id) => {
        try {
            // console.log(req)
            const deletion = await model.deleteOne({ _id: id });
            // console.log(res);
            res.status(200).send({
                response: 'Document successfully Deleted!',
                data: deletion,
            });
        }catch(err) {
            res.status(401).send({
                error: err.name,
                message: err.message
            });
        }
    },
    // Can delete and dereference 0 to many documents
    deleteAndPull: async(res, deletionModel, pullModel, query, pullKey, pullIdList) => {
        try{
            let deletions = [];
            let pullDeletions = [];

            for(let i = 0; i < pullIdList.length; i++){
                const pullId = pullIdList[i];
                const deletion = await deletionModel.remove({ _id: pullId });
                deletions.push(deletion);

                const update = { $pull: { [pullKey]: pullId }};
                const pullDeletion = await pullModel.updateOne(
                    query,
                    update
                );
                pullDeletions.push(pullDeletion);
            }

            res.status(200).send({
                response: 'Document successfully Deleted and Pulled!',
                data: {
                    ...deletions,
                    ...pullDeletions
                }
            });
        }catch(err) {
            res.status(401).send({
                error: err.name,
                message: `Error: \nSuccessfully deleted ${deletions.length} documents and pulled ${pullDeletions} documents \nerr.message`
            });
        }
    }
}