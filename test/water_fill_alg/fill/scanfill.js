scanfill = {}

scanfill.outros = {}
scanfill.canvas = null
scanfill.preenchido = false
scanfill.min_y = null
scanfill.max_y = null
scanfill.scanline_cor = "rgba(255, 0, 0, 0.7)" /* Utilizado na animação. */

scanfill.init = function ()
{
    var raster_div = document.getElementById("raster")
    var canvas_id = "scanfill"
    var canvas = document.getElementById(canvas_id)
    var canvas_animscanline = document.getElementById("scanfill-animlinha")

    if (!canvas) canvas = document.createElement("canvas")
    if (!canvas_animscanline)
	canvas_animscanline = document.createElement("canvas")
    canvas.id = canvas_id
    canvas_animscanline.id = "scanfill-animlinha"
    raster.outros.copy_info(document.getElementById("raster_demo"), canvas)
    raster.outros.copy_info(document.getElementById("raster_demo"),
			    canvas_animscanline)

    scanfill.canvas = canvas
    raster_div.appendChild(canvas)
    raster_div.appendChild(canvas_animscanline)
}

scanfill.limpar = function ()
{
    scanfill.canvas.getContext("2d").clearRect(0, 0, scanfill.canvas.width,
					       scanfill.canvas.height)
    scanfill.preenchido = false
    scanfill.min_y = raster.conf.linhas
    scanfill.max_y = 0
    scanfill.outros.retas = {}     /* Tabela de retas. */
    scanfill.outros.ativas = []    /* Retas ativas.   */
    if (scanfill.outros.animando) {
	var canvas = document.getElementById("scanfill-animlinha")
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
    }
}

scanfill.preencher = function ()
{
    var ctx = scanfill.canvas.getContext("2d")
    var temp = linha.ctx

    temp = linha.ctx
    linha.ctx = ctx

    scanfill.limpar()
    scanfill.construir_tabela_retas()
    scanfill.y = scanfill.min_y    /* Scanline atual para preenchimento. */

    scanfill.temp_ctx = temp
    if (!(document.getElementById("anim-preenchimento").checked)) {
	/* Faz apenas uma pequena animação automática. */
	scanfill.interval = setInterval(scanfill.ajustar_e_preencher_linha, 15)
    } else {
	scanfill.outros.preparar_anim()
    }
}


scanfill.ajustar_e_preencher_linha = function ()
{
    var y = scanfill.y

    scanfill.construir_tabela_ativa(y)
    if (scanfill.outros.ativas) {
	scanfill.outros.preencher_scanline()
	scanfill.atualizar_tabela_ativa(y)
    }

    scanfill.y++
    if (scanfill.y >= scanfill.max_y) {
	/* Terminou o preenchimento. scanfill.y agora deveria ser igual a
	 * scanfill.max_y, porém, se ocorrer algum bug durante o desenho
	 * talvez pode acontecer do valor de y ultrapassar o limite.
	 */
	clearInterval(scanfill.interval)
	linha.ctx = scanfill.temp_ctx
	scanfill.preenchido = true
    }
}

scanfill.construir_tabela_retas = function ()
{
    var pt1, pt2

    for (var i = 0; i < raster.selecionados.length - 1; i++) {
	pt1 = raster.pixels[raster.selecionados[i]]
	pt2 = raster.pixels[raster.selecionados[i + 1]]
	if (pt1.vy == pt2.vy) {
	    /* Reta horizontal, ignora. */
	    continue
	}

	if (pt1.vy < pt2.vy) {
	    scanfill.inserir_reta(pt1, pt2)
	} else {
	    scanfill.inserir_reta(pt2, pt1)
	}
    }

    /* As retas já estão ordenadas pelo valor de y. Agora, ordenar pelo
     * valor de x mínimo em cada y.
     */
    for (var y = scanfill.min_y; y < scanfill.max_y; y++) {
	if (!scanfill.outros.retas[y]) {
	    continue
	}
	scanfill.outros.retas[y].sort(scanfill.outros.reta_cmp)
    }
}

scanfill.construir_tabela_ativa = function (y)
{
    var retas = scanfill.outros.retas[y]
    var novas = []
    if (retas === undefined) {
	return
    }

    /* Ignora retas ativas onde o y máximo da reta é igual (chegou no
     * fim da mesma) ao parâmetro y.
     */
    for (var j = 0; j < scanfill.outros.ativas.length; j++) {
	if (scanfill.outros.ativas[j].y_max > y) {
	    novas.push(scanfill.outros.ativas[j])
	}
    }
    scanfill.outros.ativas = novas

    /* Insere retas que tem seu y mínimo como o valor do parâmetro y. */
    for (var i = 0; i < retas.length; i++) {
	scanfill.outros.ativas.push(retas[i])
    }
    /* Remove retas utilizadas agora da tabela de retas. */
    scanfill.outros.retas[y] = undefined

    scanfill.outros.ativas.sort(scanfill.outros.reta_cmp)
}

scanfill.atualizar_tabela_ativa = function(y)
{
    var ativas = scanfill.outros.ativas
    var nova_lista = []

    /* Ajustar o valor de x_min, nas retas ativas que ainda terão scanlines
     * passadas por elas, para determinar o novo ponto de intersecção.
     */
    for (var i = 0; i < ativas.length; i++) {
	if (y < ativas[i].y_max) {
	    ativas[i].x_min += ativas[i].m_inv
	    nova_lista.push(ativas[i])
	}
    }

    nova_lista.sort(scanfill.outros.reta_cmp)
    scanfill.outros.ativas = nova_lista
}

scanfill.inserir_reta = function (origem, destino)
{
    var obj = {}

    obj.m_inv = (destino.vx - origem.vx) / (destino.vy - origem.vy)
    obj.x_min = origem.vx
    obj.y_max = destino.vy

    /* Atualizar y mínimo e máximo. */
    if (destino.vy > scanfill.max_y) scanfill.max_y = destino.vy
    if (origem.vy < scanfill.min_y) scanfill.min_y = origem.vy

    /* Inserir obj. */
    if (scanfill.outros.retas[origem.vy] === undefined) {
	scanfill.outros.retas[origem.vy] = []
    }
    scanfill.outros.retas[origem.vy].push(obj)
}


scanfill.outros.reta_cmp = function (a, b)
{
    return a.x_min - b.x_min
}


/* Animação, desenho. */
scanfill.outros.preparar_anim = function ()
{
    scanfill.outros.prev_keyup = document.onkeyup
    document.onkeyup = scanfill.outros.avancar_anim
    scanfill.outros.prev_y = -1
    scanfill.outros.anim_step = 0
    scanfill.outros.animando = true
    scanfill.outros.configurar_e_marcar_scanline()
}

scanfill.outros.avancar_anim = function (event)
{
    var event = window.event || event
    var key = event.keyCode

    if (key != 39 || !scanfill.outros.animando) {
	return
    }

    /* Direita. Avançar. */
    scanfill.outros.anim_step++

    if (scanfill.outros.anim_step == 1) {
	scanfill.outros.preencher_scanline()
    } else if (scanfill.outros.anim_step == 2) {
	scanfill.atualizar_tabela_ativa(scanfill.y)
	scanfill.y++
	if (scanfill.y >= scanfill.max_y) {
	    /* Terminou o preenchimento. scanfill.y agora deveria ser igual a
	     * scanfill.max_y, porém, se ocorrer algum bug durante o desenho
	     * talvez pode acontecer do valor de y ultrapassar o limite.
	     */
	    linha.ctx = scanfill.temp_ctx
	    document.onkeyup = scanfill.outros.prev_keyup
	    scanfill.preenchido = true
	    scanfill.outros.animando = false
	    var canvas = document.getElementById("scanfill-animlinha")
	    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
	    return
	}
	scanfill.outros.anim_step = 0
	scanfill.outros.configurar_e_marcar_scanline()
    }
}

scanfill.outros.preencher_scanline = function ()
{
    var y = scanfill.y
    var retas = scanfill.outros.ativas
    var inicio, fim

    for (var i = 0; i < retas.length; i += 2) {
	if (retas[i + 1] === undefined) { /* XXX Número ímpar de ativas. */
	    console.log("problema", y, retas); continue
	}
	inicio = Math.round(retas[i].x_min)
	fim = Math.floor(retas[i + 1].x_min)
	for (var x = inicio; x <= fim; x++) {
	    linha.putpixel(x, y, raster.conf.cor_linha_bresenham)
	}
    }
}

scanfill.outros.configurar_e_marcar_scanline = function ()
{
    var retas
    var ignorar

    while (scanfill.y < scanfill.max_y) {
	ignorar = 0
	scanfill.construir_tabela_ativa(scanfill.y)
	//console.log(scanfill.outros.ativas)
	retas = scanfill.outros.ativas
	for (var i = 0; i < retas.length; i += 2) {
	    if (retas[i].x_min == retas[i + 1].x_min) {
		ignorar += 2
	    }
	}
	if (ignorar == retas.length) {
	    scanfill.atualizar_tabela_ativa(scanfill.y)
	    scanfill.y++
	} else {
	    break
	}
    }

    if (scanfill.outros.prev_y == -1 && retas.length) {
	scanfill.outros.iniciar_anim()
	scanfill.outros.prev_y = 0
	return
    }

    scanfill.outros.marcar_scanline()
}

scanfill.outros.marcar_scanline = function()
{
    var canvas = document.getElementById("scanfill-animlinha")
    var ctx = canvas.getContext("2d")
    var retas = scanfill.outros.ativas
    var x, y = scanfill.y
    var pixel_orig, pixel_dest

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (var i = 0; i < retas.length; i+= 2) {
	pixel_orig = raster.vpixels[y][Math.round(retas[i].x_min)]
	x_dest = Math.floor(retas[i + 1].x_min)
	pixel_dest = raster.vpixels[y][x_dest]

	ctx.beginPath()
	ctx.moveTo(pixel_orig.x - (raster.conf.tamanho_pixel * 3/2),
			 pixel_orig.y)
	ctx.lineTo(pixel_dest.x + (raster.conf.tamanho_pixel * 3/2),
			 pixel_dest.y)
	ctx.strokeStyle = scanfill.scanline_cor
	ctx.lineWidth = raster.conf.espessura_linha * 3
	ctx.stroke()
	ctx.closePath()
    }
}

scanfill.outros.iniciar_anim = function()
{
    function animar_scanline_base()
    {
	var canvas = document.getElementById("scanfill-animlinha")
	var ctx = canvas.getContext("2d")
	var pixel = raster.vpixels[scanfill.y][0]
	var retas = scanfill.outros.ativas
	var esq = desloc, esq_lim = false, esq_ponto
	var dir = canvas.width - desloc, dir_lim = false, dir_ponto

	esq_ponto = raster.vpixels[pixel.vy][Math.round(retas[0].x_min)]
	dir_ponto = raster.vpixels[pixel.vy][Math.round(
	    retas[retas.length-1].x_min)]
	if (esq >= (esq_ponto.x - 3/2 * raster.conf.tamanho_pixel)) {
	    esq_lim = true
	    esq = esq_ponto.x - 3/2 * raster.conf.tamanho_pixel
	}
	if (dir <= (dir_ponto.x + 3/2 * raster.conf.tamanho_pixel)) {
	    dir_lim = true
	    dir = dir_ponto.x + 3/2 * raster.conf.tamanho_pixel
	}

	scanfill.outros.marcar_scanline()

	ctx.beginPath()
	ctx.moveTo(esq, pixel.y)
	ctx.lineTo(esq_ponto.x + 3/2 * raster.conf.tamanho_pixel, pixel.y)
	ctx.moveTo(dir, pixel.y)
	ctx.lineTo(dir_ponto.x - 3/2 * raster.conf.tamanho_pixel, pixel.y)
	ctx.strokeStyle = scanfill.scanline_cor
	ctx.lineWidth = raster.conf.espessura_linha * 3
	ctx.stroke()
	ctx.closePath()

	desloc += 5
	if (esq_lim && dir_lim) {
	    clearInterval(interval)
	    ctx.clearRect(0, 0, canvas.width, canvas.height)
	    scanfill.outros.marcar_scanline()
	}
    }

    var interval = setInterval(animar_scanline_base, 15)
    var desloc = 0
}
