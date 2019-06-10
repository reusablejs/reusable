module.exports = {
  preset: 'ts-jest',
  "transform": {
    "^.+\\.jsx?$": "babel-jest", // Adding this line solved the issue
    "^.+\\.tsx?$": "ts-jest"
  }
};
