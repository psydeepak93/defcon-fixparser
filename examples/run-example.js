require('@babel/register')({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
});
require(`${__dirname}/${process.argv[2]}`);
