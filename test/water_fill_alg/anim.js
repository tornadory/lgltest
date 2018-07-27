anim = {}

anim.outros = {}
anim.canvas = null
anim.canvas_static = null
anim.info = null
anim.cache = {linhas: null, colunas: null}

anim.init = function ()
{
    var raster_div = document.getElementById("raster")
    var canvas_anim = document.getElementById("anim")
    if (!canvas_anim) canvas_anim = document.createElement("canvas")
    var canvas_static_anim = document.getElementById("anim-static")
    if (!canvas_static_anim) canvas_static_anim = document.createElement(
	"canvas")
    canvas_anim.id = "anim"
    canvas_static_anim.id = "anim-static"
    raster.outros.copy_info(document.getElementById("linha-ideal"),
			    canvas_anim)
    raster.outros.copy_info(document.getElementById("linha-ideal"),
			    canvas_static_anim)

    anim.canvas = canvas_anim
    anim.canvas_static = canvas_static_anim
    raster_div.appendChild(canvas_anim)
    raster_div.appendChild(canvas_static_anim)
}

anim.limpar = function ()
{
    anim.canvas.getContext("2d").clearRect(0, 0,
					   anim.canvas.width,
					   anim.canvas.height)
    anim.canvas_static.getContext("2d").clearRect(0, 0,
						  anim.canvas_static.width,
						  anim.canvas_static.height)
}

anim.atualizar = function()
{
    if (anim.cache.linhas !== null && anim.cache.colunas !== null) {
	if (anim.cache.linhas != raster.conf.linhas ||
	    anim.cache.colunas != raster.conf.colunas) {
	}
	anim.bresenham_parar()
    }
    anim.desenhar_pontos()
}

/* Primeiro octante somente. */
anim.algoritmo_bresenham = function (origem, destino)
{
    var x0 = origem.vx, y0 = origem.vy
    var x1 = destino.vx, y1 = destino.vy
    var dx = x1 - x0
    var dy = y1 - y0

    if (dx * dy < 0 || Math.abs(dx) < Math.abs(dy)) {
	alert("Somente o caso mais simples aceita ser animado.")
	return null
    }

    var d = 2 * dy - dx
    var incE = 2 * dy
    var incNE = 2 * (dy - dx)

    anim.info = [dx, dy, incE, incNE]
    linha.display_info_bresenham(dx, dy, d, incE, incNE, false, false)
    anim.cache.linhas = raster.conf.linhas
    anim.cache.colunas = raster.conf.colunas

    var resultado = []
    var y = y0
    for (var x = x0; x <= x1; x++) {
	resultado.push([x, y, d])
	if (d <= 0) {
	    d += incE
	} else {
	    d += incNE
	    y++
	}
    }
    return resultado
}

anim.bresenham = function()
{
    if (raster.sel_next != 2) {
	return
    }

    var pontos = anim.algoritmo_bresenham(linha.pontos[0], linha.pontos[1])
    if (pontos === null) {
	return
    }

    var botao = document.getElementById("anim_bresenham")
    var static_anim = anim.canvas_static
    static_anim.getContext("2d").clearRect(0, 0,
					   static_anim.width,
					   static_anim.height)

    anim.graus = 0
    anim.interval = setInterval(anim.bresenham_ponto_corrente, 30)
    anim.pontos = pontos
    anim.ponto_anterior_index = 0
    anim.ponto_corrente_index = 0
    document.onkeyup = anim.outros.keyup
    botao.childNodes[0].nodeValue = "Parar animação"
    botao.onclick = anim.bresenham_parar
}

anim.bresenham_parar = function()
{
    var ctx = anim.canvas.getContext("2d")
    var botao = document.getElementById("anim_bresenham")

    ctx.clearRect(0, 0, anim.canvas.width, anim.canvas.height)
    clearInterval(anim.interval)
    if (!linha.algoritmo_bresenham.desenhar) {
	linha.clear_info_bresenham()
    } else {
	linha.display_info_bresenham(undefined, undefined, "")
    }
    document.onkeyup = null

    botao.childNodes[0].nodeValue = "Animar Bresenham"
    botao.onclick = anim.bresenham
}

anim.outros.keyup = function(event)
{
    var event = window.event || event /* Firefox compatibilidade. */
    var key = event.keyCode

    if (anim.ponto_corrente_index != anim.ponto_anterior_index) {
	/* Ainda está em transição, não fazer nada. */
	return
    }

    if (key == 39) {
	/* Direita. Avançar. */
	anim.ponto_corrente_index++
	if (anim.ponto_corrente_index == anim.pontos.length) {
	    anim.bresenham_parar()
	}
    } else if (key == 37) {
	/* Esquerda. Retroceder. */
	anim.ponto_corrente_index--
	if (anim.ponto_corrente_index < 0) {
	    anim.ponto_corrente_index = 0
	}
    } else {
	/* Outra tecla qualquer. */
	return
    }

    anim.desenhar_pontos()
}

anim.outros.table_td = function (td_id)
{
    var td = document.getElementById(td_id)
    var orig_color

    if (td === undefined) {
	return
    }

    orig_color = td.style.background
    td.style.background = "yellow"
    setTimeout(function () { td.style.background = "black" }, 50)
    setTimeout(function () { td.style.background = orig_color }, 100)
}

anim.desenhar_pontos = function()
{
    var ponto
    var temp = linha.ctx

    if (!document.onkeyup) {
	return
    }

    linha.ctx = anim.canvas_static.getContext("2d")
    linha.ctx.clearRect(0, 0,
			anim.canvas_static.width,
			anim.canvas_static.height)
    for (var i = 0; i < anim.ponto_corrente_index; i++) {
	ponto = anim.pontos[i]
	linha.putpixel(ponto[0], ponto[1], raster.conf.cor_linha_bresenham)
    }
    linha.display_info_bresenham(anim.info[0], anim.info[1],
				 anim.pontos[anim.ponto_corrente_index][2],
				 anim.info[2], anim.info[3], false, false)
    anim.outros.table_td("delta")

    if (anim.ponto_corrente_index != anim.ponto_anterior_index) {
	clearInterval(anim.interval)
	anim.desloc_x = 0
	anim.desloc_y = 0
	anim.interval = setInterval(anim.bresenham_move_ponto, 30)
    }

    linha.ctx = temp
}

anim.bresenham_move_ponto = function ()
{
    var ctx = anim.canvas.getContext("2d")
    var pt_prev = anim.ponto_anterior_index
    var ponto = raster.vpixels[anim.pontos[pt_prev][1]][anim.pontos[pt_prev][0]]
    var pt_next = anim.ponto_corrente_index
    var ponto2 = raster.vpixels[anim.pontos[pt_next][1]][
	anim.pontos[pt_next][0]]
    var xdeslocamento, ydeslocamento

    ctx.clearRect(0, 0, anim.canvas.width, anim.canvas.height)

    /* Deslocar retângulo giratório para o ponto seguinte. */
    ctx.beginPath()
    ctx.save()
    if (ponto.vy != ponto2.vy) {
	ydeslocamento = ponto.y - anim.desloc_y
	if (ydeslocamento <= ponto2.y) {
	    ydeslocamento = ponto2.y
	}
    } else {
	ydeslocamento = ponto.y
    }
    xdeslocamento = ponto.x + anim.desloc_x
    if (xdeslocamento >= ponto2.x) {
	xdeslocamento = ponto2.x
	clearInterval(anim.interval)
	anim.desloc_x = 0
	anim.desloc_y = 0
	anim.interval = setInterval(anim.bresenham_ponto_corrente, 30)
	anim.ponto_anterior_index = anim.ponto_corrente_index
    }
    ctx.translate(xdeslocamento, ydeslocamento)
    ctx.rotate(anim.graus * Math.PI / 180)
    ctx.rect(-raster.conf.tamanho_pixel * 2, -raster.conf.tamanho_pixel * 2,
	     raster.conf.tamanho_pixel * 4, raster.conf.tamanho_pixel * 4)
    ctx.fillStyle = raster.conf.cor_linha_bresenham
    ctx.fill()
    ctx.restore()
    ctx.closePath()

    anim.desloc_x += 3
    anim.desloc_y += 3
    anim.graus = (anim.graus + 5) % 360
}

anim.bresenham_ponto_corrente = function ()
{
    var ctx = anim.canvas.getContext("2d")
    var ponto = raster.vpixels[anim.pontos[anim.ponto_corrente_index][1]][
	anim.pontos[anim.ponto_corrente_index][0]]

    ctx.clearRect(0, 0, anim.canvas.width, anim.canvas.height)

    /* Retângulo girando demonstrando ponto corrente. */
    ctx.beginPath()
    ctx.save()
    ctx.translate(ponto.x, ponto.y)
    ctx.rotate(anim.graus * Math.PI / 180)
    ctx.rect(-raster.conf.tamanho_pixel * 2, -raster.conf.tamanho_pixel * 2,
	     raster.conf.tamanho_pixel * 4, raster.conf.tamanho_pixel * 4)
    ctx.fillStyle = raster.conf.cor_linha_bresenham
    ctx.fill()
    ctx.restore()
    ctx.closePath()

    /* Possíveis destinos. */
    if (anim.ponto_corrente_index < anim.pontos.length - 1) {
	ctx.beginPath()
	ctx.save()
	ctx.lineWidth = raster.conf.espessura_linha * 2
	/* Ponto a direita do x atual. */
	var pt = raster.vpixels[ponto.vy][ponto.vx + 1]
	ctx.moveTo(ponto.x, ponto.y)
	ctx.lineTo(pt.x, ponto.y)
	/* Ponto a diagonal do atual. */
	pt = raster.vpixels[ponto.vy + 1][ponto.vx + 1]
	ctx.moveTo(ponto.x, ponto.y)
	ctx.lineTo(pt.x, pt.y)

	ctx.stroke()
	ctx.restore()
	ctx.closePath()
    }

    anim.graus = (anim.graus + 5) % 360
}
