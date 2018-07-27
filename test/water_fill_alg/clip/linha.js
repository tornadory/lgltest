linha = {}

linha.algoritmos = []
linha.outros = {}
linha.ctx = null
linha.canvas = null
linha.fechado = false /* Se true, clicar não seleciona pontos para retas. */

linha.init = function (canvas_id)
{
    var raster_div = document.getElementById("raster")
    var canvas = document.getElementById(canvas_id)

    if (!canvas) canvas = document.createElement("canvas")
    canvas.id = canvas_id
    raster.outros.copy_info(document.getElementById("raster_demo"), canvas)

    linha.canvas = canvas
    raster_div.appendChild(canvas)
}

linha.atualizar = function ()
{
    linha.limpar()
    recorte.limpar()

    if (raster.selecionados.length < 2) {
	/* Nenhuma linha a desenhar. */
	linha.fechado = false
	return
    }

    linha.desenhar_retas()

    linha.ctx = null
}

linha.limpar = function ()
{
    var canvas = linha.canvas

    linha.ctx = canvas.getContext("2d")
    linha.ctx.clearRect(0, 0, canvas.width, canvas.height)
}

linha.desenhar_retas = function ()
{
    var origem, destino

    /* Desenha pares de retas */
    for (var i = 0; i < raster.selecionados.length; i += 2) {
	origem = raster.selecionados[i]
	destino = raster.selecionados[i + 1]
	if (destino == undefined)
	    break
	linha.algoritmo_bresenham(raster.pixels[origem],
				  raster.pixels[destino])
    }
}

linha.putpixel = function (x, y, cor)
{
    var pixel = raster.vpixels[y][x]
    var ctx = linha.ctx

    ctx.beginPath()
    ctx.moveTo(pixel.x, pixel.y)
    ctx.arc(pixel.x, pixel.y, raster.conf.tamanho_pixel, 0, 2 * Math.PI, false)
    ctx.fillStyle = cor
    ctx.fill()
    ctx.closePath()
}

linha.algoritmo_bresenham = function(origem, destino)
{
    var x0 = origem.vx, y0 = origem.vy
    var x1 = destino.vx, y1 = destino.vy
    var dx = x1 - x0
    var dy = y1 - y0
    var declive = false, simetrico = false
    var temp

    if (dx * dy < 0) {
	y0 = -y0
	y1 = -y1
	dy = -dy
	simetrico = true
    }

    if (Math.abs(dx) < Math.abs(dy)) {
	temp = dx
	dx = dy
	dy = temp

	temp = x0
	x0 = y0
	y0 = temp

	temp = x1
	x1 = y1
	y1 = temp

	declive = true
    }

    if (x0 > x1) {
	temp = x0
	x0 = x1
	x1 = temp

	temp = y0
	y0 = y1
	y1 = temp

	dx = -dx
	dy = -dy
    }

    var d = 2 * dy - dx
    var incE = 2 * dy
    var incNE = 2 * (dy - dx)

    var px, py, y = y0
    for (var x = x0; x <= x1; x++) {
	if (declive) {
	    px = y
	    py = x
	} else {
	    px = x
	    py = y
	}

	if (simetrico) {
	    py = -py
	}

	linha.putpixel(px, py, raster.conf.cor_linha_bresenham)
	if (d <= 0) {
	    d += incE
	} else {
	    d += incNE
	    y++
	}
    }
}
