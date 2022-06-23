exports.getPath = (using_npm) => {
    const args_start_index = using_npm ? 2 : 2;
    let input_path = null;
    const args = process.argv;
    switch (args.length) {
        case args_start_index:
            input_path = process.cwd();
            console.log('INFO: File or directory not specified, defaulting to current directory.');
            break;
        case args_start_index + 1:
            input_path = args[args_start_index];
            break;
        default:
            const base_command = using_npm ? 'xliff-to-json' : 'node app.js'
            console.log(`ERROR: Args count mismatch! Usage is: ${base_command} [file or directory]`)
            return null;
    }
    return input_path;
}
