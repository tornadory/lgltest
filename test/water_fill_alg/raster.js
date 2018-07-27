var raster = {conf : {}}

/* Configurações */
raster.conf.largura_janela = 750    /* pixels */
raster.conf.altura_janela = 350     /* pixels */
raster.conf.tamanho_pixel = 10      /* pixels */
raster.conf.desenhar_pixels = true  /* Cuidado! Pode deixar lento. */
raster.conf.colunas = 20            /* mínimo = 2 */
raster.conf.linhas = 10             /* mínimo = 2 */
raster.conf.espessura_linha = 1     /* pixels */
raster.conf.cor_pixel = "rgb(210, 210, 210)"
raster.conf.cor_pixel_selecao = "black"
raster.conf.cor_linha = "rgb(230, 230, 230)"
raster.conf.cor_linha_ideal = "black"
raster.conf.cor_linha_bresenham = "rgba(0, 0, 255, 0.5)"
raster.conf.cor_linha_incremental = "rgba(255, 0, 0, 0.5)"
raster.conf.cor_linha_imediato = "rgba(0, 255, 0, 0.5)"
/* Fim configurações */

raster.outros = {}
raster.pixels = []
raster.vpixels = []
raster.selecionados = [null, null]
raster.sel_next = 0

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
    var canvas, pixel_sel, linha_ideal

    canvas = document.getElementById(id)
    if (!canvas) canvas = document.createElement("canvas")
    pixel_sel = document.getElementById("pixel-sel")
    if (!pixel_sel) pixel_sel = document.createElement("canvas")
    linha_ideal = document.getElementById("linha-ideal")
    if (!linha_ideal) linha_ideal = document.createElement("canvas")

    canvas.id = id
    canvas.width = width
    canvas.height = height
    canvas.style.position = "absolute"
    canvas.style.left = "0px"
    canvas.style.top = "0px"

    pixel_sel.id = "pixel-sel"
    raster.outros.copy_info(canvas, pixel_sel)

    linha_ideal.id = "linha-ideal"
    raster.outros.copy_info(canvas, linha_ideal)

    return [canvas, pixel_sel, linha_ideal]
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
	    p = {x : x, y : y, vx : j, vy : num_linhas - i}
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


raster.outros.selecionar = function(event)
{
    var x_click = event.offsetX || event.layerX /* Firefox compatibilidade. */
    var y_click = event.offsetY || event.layerY /* Firefox compatibilidade. */
    var x_dist, y_dist, pixel
    var max_dist = raster.conf.tamanho_pixel
    var apagar = false

    /* Verificar se o clique do mouse atingiu algum pixel. */
    for (var i = 0; i < raster.pixels.length; i++) {
	pixel = raster.pixels[i]
	x_dist = Math.abs(x_click - pixel.x)
	y_dist = Math.abs(y_click - pixel.y)

	if (x_dist <= max_dist && y_dist <= max_dist) {
	    /* Algum pixel foi atingido. */
	    if (raster.selecionados[0] == i) {
		/* Remove pixel já selecionado. */
		raster.selecionados[0] = raster.selecionados[1]
		raster.selecionados[1] = null
		raster.sel_next--
		apagar = true
		//console.log("removendo", i)
	    } else if (raster.selecionados[1] == i) {
		/* Remove pixel já selecionado. */
		raster.selecionados[1] = null
		raster.sel_next = 1
		apagar = true
		//console.log("removendo", i)
	    }

	    if (apagar === false) {
	        /* Seleciona novo pixel. */
		if (raster.sel_next < 2) {
		    //console.log("adicionando", i)
		    raster.selecionados[raster.sel_next++] = i
		}
	    }
	    break
	}
    }

    //console.log(raster.selecionados, raster.sel_next)
    raster.outros.atualiza_selecao()
}

raster.outros.atualiza_selecao = function ()
{
    var pixel
    var layer = document.getElementById("pixel-sel")
    var ctx = layer.getContext("2d")
    ctx.clearRect(0, 0, layer.width, layer.height)

    /* Pintar pixel(s) selecionado(s). */
    for (var i = 0; i < raster.sel_next; i++) {
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
    linha.atualizar(raster.sel_next)
}

raster.outros.deselecionar = function ()
{
    raster.selecionados = [null, null]
    raster.sel_next = 0
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
    for (var i = 0; i < raster.sel_next; i++) {
	var p = raster.selecionados[i]
	//console.log(p, raster.pixels[p])
	if (raster.pixels[p] === undefined) {
	    var array_p = raster.vpixels[raster.conf.linhas - 1]
	    for (var j = array_p.length - 1; i >= 0; i--) {
		if (array_p[j].vx < raster.conf.colunas) {
		    /* Achei um pixel razoável para substituir. Encontrar
		     esse pixel em raster.pixels. */
		    for (var x = 0; x < raster.pixels.length; x++) {
			if (raster.pixels[x] == array_p[j]) {
			    //console.log("substitui")
			    raster.selecionados[i] = x
			    break
			}
		    }
		    break
		}
	    }
	}
    }

    raster.outros.atualiza_selecao()
}

raster.outros.atualizar_linha = function(event)
{
    var obj = linha["algoritmo_" + event.target.name]
    obj.desenhar = !obj.desenhar
    raster.outros.atualiza_selecao()
}


raster.init_desenho = function ()
{
    raster.selecionados = [null, null]
    raster.sel_next = 0

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
    var falhou = false
    /* Verificar se o browser suporta canvas. */
    if (document.createElement) {
	var teste = document.createElement('canvas')
	if (!(!!(teste && teste.getContext && teste.getContext('2d')))) {
	    falhou = true
	}
    } else {
	falhou = true
    }
    if (falhou) {
	alert("Seu navegador não tem suporte ao elemento canvas.\n\
Tente novamente utilizando algo como Chrome, Firefox, \
Opera, Safari, etc..")
    }

    var elems = raster.init_desenho()
    var raster_div = document.getElementById("raster")

    for (var i = 0; i < elems.length; i++) {
	raster_div.appendChild(elems[i])
    }

    raster.malha_pixels()
    linha.init()
    raster_div.addEventListener("click", raster.outros.selecionar, false)

    /* Construir checkboxes para algoritmos implementados. */
    var ul_linhas = document.getElementById("linhas")
    var li, text, input
    for (var obj in linha) {
	var nome = obj.split("_")
	if (nome[0] == "algoritmo") {
	    //console.log(nome[1])
	    li = document.createElement("li")
	    input = document.createElement("input")
	    input.type = "checkbox"
	    input.name = nome[1]
	    input.checked = true
	    input.onclick = raster.outros.atualizar_linha
	    text = document.createTextNode(nome[1])
	    li.appendChild(input)
	    li.appendChild(text)
	    ul_linhas.appendChild(li)
	}
    }
    /* Preencher outros campos. */
    document.getElementById("r_width").value = raster.conf.largura_janela
    document.getElementById("r_height").value = raster.conf.altura_janela
    document.getElementById("r_cols").value = raster.conf.colunas
    document.getElementById("r_rows").value = raster.conf.linhas
    document.getElementById("r_psize").value = raster.conf.tamanho_pixel
    document.getElementById("r_spixel").checked = raster.conf.desenhar_pixels
}
