global.channel = function(){
    this.tags = ['channel'];
    this.parse = function (parser,nodes,lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        return new nodes.CallExtensionAsync(this, 'run', args)
    };
    this.run = async function (context, args, callback) {
        let data = think.isEmpty(args.data) ?"data":args.data;
        let channel = await think.model('channel').getCachedChannels();
        // channel = arr_to_tree(channel,0);
        //console.log(channel);
        context.ctx[data] = channel;
        return callback(null,'');
    }
}