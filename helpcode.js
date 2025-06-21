// Endpoint to handle GET requests
app.get('/', (req, res) => {
    studentmodel.find().then(
        (students) => {
            res.json(students);
        }
    ).catch(() => {
        res.status(500).json({
            message: "Error fetching data",
        });
    })

});

// ✅ POST route
app.post('/', (req, res) => {


    const student = new studentmodel(req.body);

    student.save().then(() => {
        console.log("Data saved successfully");
        res.json({
            message: "Data saved successfully"
        });
    }).catch((err) => {
        res.json({
            message: "Error saving data",
            error: err
        });
    });
});

// DELETE request handler
app.delete('/data', (req, res) => {
    console.log("delete request received");
    console.log(req.body);

    res.json({
        message: "Data deleted successfully!",
        data: req.body
    });
});

// PUT request handler
app.put('/data', (req, res) => {
    const { id, name, age, email } = req.body;

    studentmodel.findByIdAndUpdate(id, { name, age, email }).then(() => {
        res.json({
            message: "Data updated successfully!",
            data: req.body
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error updating data",
            error: err
        });
    });
});