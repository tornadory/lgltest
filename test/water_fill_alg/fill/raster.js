var raster = {conf : {}}

/* Configurações */
raster.conf.largura_janela = 350    /* pixels */
raster.conf.altura_janela = 350     /* pixels */
raster.conf.tamanho_pixel = 1       /* pixels */
raster.conf.desenhar_pixels = false /* Cuidado! (true) Pode deixar lento. */
raster.conf.colunas = 350           /* mínimo = 2 */
raster.conf.linhas = 350            /* mínimo = 2 */
raster.conf.espessura_linha = 1     /* pixels */
raster.conf.cor_pixel = "rgb(220, 220, 220)"
raster.conf.cor_pixel_selecao = "black"
raster.conf.cor_linha = "rgb(230, 230, 230)"
raster.conf.cor_linha_bresenham = "rgba(0, 0, 255, 0.5)"
/* Fim configurações */

raster.outros = {}
raster.pixels = []
raster.vpixels = []
raster.selecionados = []

raster.outros.copy_info = function (src, dest)
{
    dest.width = src.width
    dest.height = src.height
    dest.style.position = src.style.position
    dest.style.left = src.style.left
    dest.style.top = src.style.top
}

raster.inicia_base_desenho = function (id, width, height)
{
    var canvas, pixel_sel

    canvas = document.getElementById(id)
    if (!canvas) canvas = document.createElement("canvas")
    pixel_sel = document.getElementById("pixel-sel")
    if (!pixel_sel) pixel_sel = document.createElement("canvas")

    canvas.id = id
    canvas.width = width
    canvas.height = height
    canvas.style.position = "absolute"
    canvas.style.left = "0px"
    canvas.style.top = "0px"

    pixel_sel.id = "pixel-sel"
    raster.outros.copy_info(canvas, pixel_sel)

    return [canvas, pixel_sel]
}

raster.malha_pixels = function()
{
    var canvas = document.getElementById("raster_demo")
    var num_linhas = raster.conf.linhas, num_colunas = raster.conf.colunas
    var pixel_size = raster.conf.tamanho_pixel
    var line_width = raster.conf.espessura_linha
    var ctx = canvas.getContext("2d")
    var dx = (canvas.width - 2*(pixel_size+line_width)) / (num_colunas - 1)
    var dy = (canvas.height - 2*(pixel_size+line_width)) / (num_linhas - 1)
    var pos, x, y

    raster.pixels = []

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.lineWidth = line_width
    ctx.strokeStyle = raster.conf.cor_linha

    /* Malha */
    ctx.beginPath()
    pos = pixel_size + line_width
    for (var i = 0; i < num_colunas; i++) {
	ctx.moveTo(pos, canvas.height - pixel_size)
	ctx.lineTo(pos, pixel_size)
	pos += dx
    }
    pos = pixel_size + line_width
    for (var i = 0; i < num_linhas; i++) {
	ctx.moveTo(pixel_size, pos)
	ctx.lineTo(canvas.width - pixel_size, pos)
	pos += dy
    }
    ctx.stroke()
    ctx.closePath()

    /* Pixels */
    var p
    y = canvas.height - (pixel_size + line_width)
    for (var i = num_linhas; i > 0; i--) {
	x = pixel_size + line_width
	raster.vpixels[num_linhas - i] = []
	for (var j = 0; j < num_colunas; j++) {
	    if (raster.conf.desenhar_pixels) {
		ctx.moveTo(x, y)
		ctx.arc(x, y, pixel_size, 0, 2 * Math.PI, false)
	    }
	    p = {x : x, y : y, vx : j, vy : num_linhas - i,
		 index : raster.pixels.length }
	    raster.pixels.push(p)
	    raster.vpixels[num_linhas - i].push(p)
	    x += dx
	}
	y -= dy
    }
    if (raster.conf.desenhar_pixels) {
	ctx.fillStyle = raster.conf.cor_pixel
	ctx.fill()
    }
}


/* Encontra o pixel que se enquadra no ponto x, y da malha de acordo com o
 * tamanho do pixel definido.
 */
raster.outros.click_to_pixel = function(x, y)
{
    var limite = raster.conf.tamanho_pixel
    var x_dist, y_dist, pixel

    for (var i = 0; i < raster.pixels.length; i++) {
	pixel = raster.pixels[i]
	x_dist = Math.abs(x - pixel.x)
	y_dist = Math.abs(y - pixel.y)

	if (x_dist <= limite && y_dist <= limite) {
	    /* Algum pixel foi atingido. */
	    return i
	}
    }
    return null
}

raster.outros.selecionar = function(event)
{
    var x_click = event.offsetX || event.layerX
    var y_click = event.offsetY || event.layerY
    var apagar = null

    if (linha.fechado) {
	return
    }

    /* Verificar se o clique do mouse atingiu algum pixel. */
    var pixel_index = raster.outros.click_to_pixel(x_click, y_click)
    if (pixel_index === null) {
	return
    }

    for (var i = 0; i < raster.selecionados.length; i++) {
	if (raster.selecionados[i] == pixel_index) {
	    /* Desmarcar pixel. */
	    apagar = i
	    break
	}
    }
    if (apagar === null) {
	/* Seleciona novo pixel. */
	raster.selecionados.push(pixel_index)
    } else {
	/* Remove pixel. */
	var parte1 = raster.selecionados.slice(0, apagar)
	var parte2 = raster.selecionados.slice(apagar + 1)
	raster.selecionados = parte1.concat(parte2)
    }

    raster.outros.atualiza_selecao()
}

raster.outros.atualiza_selecao = function ()
{
    var pixel
    var layer = document.getElementById("pixel-sel")
    var ctx = layer.getContext("2d")
    ctx.clearRect(0, 0, layer.width, layer.height)

    /* Pintar pixel(s) selecionado(s). */
    for (var i = 0; i < raster.selecionados.length; i++) {
	ctx.beginPath()
	pixel = raster.pixels[raster.selecionados[i]]
	ctx.moveTo(pixel.x, pixel.y)
	ctx.arc(pixel.x, pixel.y, raster.conf.tamanho_pixel, 0,
		2 * Math.PI, false)
	ctx.fillStyle = raster.conf.cor_pixel_selecao
	ctx.fill()
	ctx.closePath()
    }

    /* Atualizar raster de linhas. */
    linha.atualizar()
}

raster.outros.deselecionar = function ()
{
    raster.selecionados = []
    raster.outros.atualiza_selecao()
}

raster.outros.atualizar_resolucao = function ()
{
    var p_size = parseInt(document.getElementById("r_psize").value)
    var spixel = document.getElementById("r_spixel").checked
    var rows = parseInt(document.getElementById("r_rows").value)
    var cols = parseInt(document.getElementById("r_cols").value)
    var width = document.getElementById("r_width").value
    var height = document.getElementById("r_height").value

    if (width != raster.conf.largura_janela ||
	height != raster.conf.altura_janela) {
	/* Força reinicialização se largura ou altura foram alterados. */
	raster.conf.largura_janela = width
	raster.conf.altura_janela = height
	raster.init_desenho()
    }

    raster.conf.desenhar_pixels = spixel
    raster.conf.tamanho_pixel = p_size

    /* Atualiza número de linhas e colunas. */
    if (rows != raster.conf.linhas) raster.conf.linhas = rows
    if (cols != raster.conf.colunas) raster.conf.colunas = cols

    raster.malha_pixels()

    /* Possivelmente atualiza pontos selecionados para caber no novo
       número de linhas e colunas. (XXX Não está bom) */
    for (var i = 0; i < raster.selecionados.length; i++) {
	var p = raster.selecionados[i]
	if (raster.pixels[p] === undefined) {
	    var array_p = raster.vpixels[raster.conf.linhas - 1]
	    for (var j = array_p.length - 1; i >= 0; i--) {
		if (array_p[j].vx < raster.conf.colunas) {
		    /* Achei um pixel razoável para substituir. Encontrar
		     esse pixel em raster.pixels. */
		    for (var x = 0; x < raster.pixels.length; x++) {
			if (raster.pixels[x] == array_p[j]) {
			    raster.selecionados[i] = x
			    break
			}
		    }
		    break
		}
	    }
	}
    }

    //console.log(raster.selecionados)
    raster.outros.atualiza_selecao()
}


raster.init_desenho = function ()
{
    raster.selecionados = []

    var elems = raster.inicia_base_desenho("raster_demo",
				  raster.conf.largura_janela,
				  raster.conf.altura_janela)
    var raster_div = document.getElementById("raster")
    var canvas = elems[0]

    raster_div.style.width = canvas.width + "px"
    raster_div.style.height = canvas.height + "px"

    for (var i = 0; i < raster_div.childNodes.length; i++) {
	var child = raster_div.childNodes[i]
	if (child.nodeType == 1) {
	    child.width = canvas.width
	    child.height = canvas.height
	}
    }

    /* Ajusta posição do div "foot". */
    var foot = document.getElementById("foot")
    foot.style.width = raster_div.style.width

    return elems
}

raster.init = function ()
{
    var elems = raster.init_desenho()
    var raster_div = document.getElementById("raster")

    for (var i = 0; i < elems.length; i++) {
	raster_div.appendChild(elems[i])
    }

    raster.malha_pixels()
    raster_div.addEventListener("click", raster.outros.selecionar, false)

    /* Os dois bugs seguintes foram corrigidos. */
    //raster.conf.tamanho_pixel = 10
    //raster.conf.colunas = 10
    //raster.conf.linhas = 10
    //raster.malha_pixels()
    /* Demo teste. Bug 1 (preencher). */
    //raster.selecionados = [50, 5, 99]
    /* Demo teste. Bug 2 (preencher). */
    //raster.selecionados = [94, 60, 11, 5, 49, 88]
    //
    //raster.outros.atualiza_selecao()
    //raster.malha_pixels()
    /* Encontrado um bug no preenchimento, mas já foi corrigido. */
    /*raster.conf.tamanho_pixel = 6
    raster.conf.colunas = 30
    raster.conf.linhas = 30
    raster.malha_pixels()
    raster.selecionados = [172, 575, 716]
    raster.malha_pixels()*/

    /* Preencher outros campos. */
    document.getElementById("r_width").value = raster.conf.largura_janela
    document.getElementById("r_height").value = raster.conf.altura_janela
    document.getElementById("r_cols").value = raster.conf.colunas
    document.getElementById("r_rows").value = raster.conf.linhas
    document.getElementById("r_psize").value = raster.conf.tamanho_pixel
    document.getElementById("r_spixel").checked = raster.conf.desenhar_pixels

    if (window['loadFirebugConsole']) {
	window.loadFirebugConsole()
    }
}
