module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    reporters: [
        "default",
        [
            "./node_modules/jest-html-reporter",
            {
                pageTitle: "Test-Report",
                outputPath: "./coverage/Movies-Unit-Test-Report.html",
                includeFailureMsg: true
            }
        ]
    ],
};