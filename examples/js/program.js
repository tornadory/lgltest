function Program(vs, fs) {
    this.vertexShader = Program.createShader(gl.VERTEX_SHADER, vs);
    this.fragmentShader = Program.createShader(gl.FRAGMENT_SHADER, fs);
    this.program = Program.createProgram(this.vertexShader, this.fragmentShader);
    this.uniform = Program.createUniforms(this.program);
    this.attribute = Program.createAttributes(this.program);
}

Program.prototype = {
    constructor: Program,
    use: function () {
        gl.useProgram(this.program);
    },
    dispose: function () {
        gl.deleteShader(this.vertexShader);
        gl.deleteShader(this.fragmentShader);
        gl.deleteProgram(this.program);
    },
};

Program.createShader = function (type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        return null;
    };

    return shader;
};

Program.createProgram = function (vshader, fshader) {
    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
        return null;
    }

    return program;
};

Program.createUniforms = function (program) {
    var uniform = {};

    var activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < activeUniforms; i++) {
        var u = gl.getActiveUniform(program, i);
        var name = u.name;
        var position = gl.getUniformLocation(program, name);
        uniform[name] = position;
    }

    return uniform;
};

Program.createAttributes = function (program) {
    var attribute = {};

    var activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < activeAttributes; i++) {
        var a = gl.getActiveAttrib(program, i);
        attribute[a.name] = i;
    }

    return attribute;
};

Program.fromScript = function (vsId, fsId) {
    var vsource = document.getElementById(vsId).text;
    var fsource = document.getElementById(fsId).text;

    return new Program(vsource, fsource);
}