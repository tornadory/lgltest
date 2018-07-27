linha = {}

linha.algoritmos = []
linha.outros = {}
linha.ctx = null
linha.pontos = null

linha.init = function ()
{
    for (var obj in linha) {
	var nome = obj.split("_")
	if (nome[0] == "algoritmo") {
	    linha[obj].desenhar = true
            linha.algoritmos.push(linha[obj])
	}
    }

    anim.init()
}

linha.atualizar = function (qntd_pontos)
{
    var linha_ideal = document.getElementById("linha-ideal")
    var ctx = linha_ideal.getContext("2d")
    var origem, destino

    ctx.clearRect(0, 0, linha_ideal.width, linha_ideal.height)
    anim.limpar()

    linha.clear_info_bresenham()

    if (qntd_pontos != 2) {
	/* Nenhuma linha a desenhar. */
	if (anim.interval) {
	    /* Para animação. */
	    anim.bresenham_parar()
	}
	return
    }

    origem = raster.pixels[raster.selecionados[0]]
    destino = raster.pixels[raster.selecionados[1]]

    /* Ponto com menor x é tomado como origem. */
    if (origem.vx > destino.vx) {
	var temp = destino
	destino = origem
	origem = temp
    }

    //console.log(origem, destino)
    linha.ctx = ctx
    linha.pontos = [origem, destino]
    for (var i = 0; i < linha.algoritmos.length; i++) {
        var obj = linha.algoritmos[i]
	if (obj.desenhar) {
	    obj(origem, destino)
	}
    }
    linha.ctx = null

    anim.atualizar()
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


linha.algoritmo_ideal = function (origem, destino)
{
    /* Desenha uma linha entre origem e destino sem considerar a resolução. */
    var x0 = origem.x, x1 = destino.x
    var y0 = origem.y, y1 = destino.y
    var ctx = linha.ctx

    ctx.beginPath()
    ctx.lineWidth = raster.conf.tamanho_pixel + 1
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.strokeStyle = raster.conf.cor_linha_ideal
    ctx.stroke()
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

    linha.display_info_bresenham(dx, dy)

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

    /* Remover essa verificação é um bug. Cuidado. */
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

    linha.display_info_bresenham(undefined, undefined, undefined, incE, incNE,
				 declive, simetrico)

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


linha.algoritmo_incremental = function (origem, destino)
{
    var x0 = origem.vx, y0 = origem.vy
    var x1 = destino.vx, y1 = destino.vy
    var m = (y1 - y0) / (x1 - x0)
    var y = y0

    for (var x = x0; x <= x1; x++) {
	linha.putpixel(x, Math.round(y), raster.conf.cor_linha_incremental)
	y += m
    }
}

linha.algoritmo_imediato = function (origem, destino)
{
    var x0 = origem.vx, y0 = origem.vy
    var x1 = destino.vx, y1 = destino.vy
    var m = (y1 - y0) / (x1 - x0)
    var b = y0 - m * x0
    var y

    if (!(x1 - x0)) {
	linha.putpixel(x0, y0, raster.conf.cor_linha_imediato)
	linha.putpixel(x1, y1, raster.conf.cor_linha_imediato)
	return
    }

    for (var x = x0; x <= x1; x++) {
	y = Math.round(m * x + b)
	linha.putpixel(x, y, raster.conf.cor_linha_imediato)
    }
}


linha.display_info_bresenham = function (dx, dy, d, incE, incNE, declive, sime)
{
    if (dx !== undefined) document.getElementById("dx").innerHTML = dx
    if (dy !== undefined) document.getElementById("dy").innerHTML = dy
    if (d !== undefined) document.getElementById("delta").innerHTML = d
    if (incE !== undefined) document.getElementById("incE").innerHTML = incE
    if (incNE !== undefined) document.getElementById("incNE").innerHTML = incNE
    if (declive !== undefined) document.getElementById(
	"declive").innerHTML = declive
    if (sime !== undefined) document.getElementById(
	"simetrico").innerHTML = sime
}

linha.clear_info_bresenham = function ()
{
    var nomes = ["dx", "dy", "delta", "incE", "incNE", "declive", "simetrico"]
    for (var i = 0; i < nomes.length; i++) {
	document.getElementById(nomes[i]).innerHTML = ""
    }
}
