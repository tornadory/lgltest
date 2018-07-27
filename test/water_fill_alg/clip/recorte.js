recorte = {}
recorte.outros = {}
recorte.canvas = null
recorte.pontos_area = [] /* Pontos (2) que definem a área de recorte. */
recorte.fechado = false /* Se true, area de recorte já foi definida. */
recorte.operacoes = null /* Operações executadas pelo algoritmo de recorte. */


recorte.init = function ()
{
    var raster_div = document.getElementById("raster")
    var canvas_id = "recorte"
    var canvas = document.getElementById(canvas_id)
    var animacao = document.getElementById("recorte-anim")
    var anim_linha = document.getElementById("recorte-animlinha")

    if (!canvas) canvas = document.createElement("canvas")
    if (!animacao) animacao = document.createElement("canvas")
    if (!anim_linha) anim_linha = document.createElement("canvas")
    canvas.id = canvas_id
    animacao.id = "recorte-anim"
    anim_linha.id = "recorte-animlinha"

    raster.outros.copy_info(document.getElementById("raster_demo"), canvas)
    raster.outros.copy_info(document.getElementById("raster_demo"), animacao)
    raster.outros.copy_info(document.getElementById("raster_demo"), anim_linha)

    recorte.canvas = canvas
    raster_div.appendChild(anim_linha)
    /* Inverter essa ordem do appendChild causa problema no Chrome
     * (provavelmente o código aqui tem algum problema)
     */
    raster_div.appendChild(animacao)
    raster_div.appendChild(canvas)

    linha.fechado = false
}


recorte.limpar = function ()
{
    var ctx = recorte.canvas.getContext("2d")
    var anim = document.getElementById("recorte-anim")

    ctx.clearRect(0, 0, recorte.canvas.width, recorte.canvas.height)
    anim.getContext("2d").clearRect(0, 0, anim.width, anim.height)
    recorte.pontos_area = []
    recorte.fechado = false
    linha.fechado = false

    recorte.canvas.removeEventListener("click", recorte.outros.selecionar_area,
				       false)
    recorte.canvas.onmousemove = null

    /* Parar animação de recorte se estiver sendo feita. */
    if (recorte.recortando) {
	clearInterval(recorte.outros.anim_interval)
	document.onkeyup = recorte.temp_keyup
	recorte.recortando = false
	anim = document.getElementById("recorte-animlinha")
	anim.getContext("2d").clearRect(0, 0, anim.width, anim.height)
    }
}

recorte.definir_area = function ()
{
    if (linha.fechado) {
	/* Já esta definindo/definido uma área de recorte. */
	return
    }
    if (raster.selecionados.length % 2) {
	/* Um último ponto foi selecionado mas não formou uma reta. */
	raster.selecionados.pop()
	raster.outros.atualiza_selecao()
    }
    raster.outros.prev_keyup = document.onkeyup
    document.onkeyup = recorte.esquecer_area
    linha.fechado = true
    recorte.canvas.addEventListener("click",
				    recorte.outros.selecionar_area, false)
}

recorte.esquecer_area = function (event)
{
    var event = window.evenet || event
    var key = event.keyCode

    if (key == 27) {
	/* Limpar área de recorte e voltar ao desenho de retas. */
	document.onkeyup = raster.outros.prev_keyup
	recorte.limpar()
    }
}


recorte.cohen_sutherland = function ()
{
    var cs

    if (!recorte.fechado) {
	/* Área de recorte ainda não foi definida. */
        return
    }
    if (recorte.recortando) {
	/* Recorte em andamento. */
	return
    }

    recorte.operacoes = []

    for (var i = 0; i < raster.selecionados.length; i += 2) {
        origem = raster.pixels[raster.selecionados[i]]
        destino = raster.pixels[raster.selecionados[i + 1]]

	cs = recorte.cs_recorta(origem.vx, origem.vy, destino.vx, destino.vy)

	cs.origem = origem
	cs.destino = destino
	recorte.operacoes.push(cs)
    }

    recorte.outros.iniciar_animacao()
}

recorte.cs_recorta = function (x0, y0, x1, y1)
{
    var recortes = [], cortes_origem

    var esq = 1, dir = 2, base = 4, topo = 8
    function codifica(x, y) {
	var c = 0
	if (x < recorte.min_vx) c = esq
	else if (x > recorte.max_vx) c = dir
	if (y < recorte.min_vy) c = c | base
	else if (y > recorte.max_vy) c = c | topo
	return c
    }

    function recorta_ponta(codigo) {
	var posicao

	if (codigo & esq) {
	    pt_x = recorte.min_vx
	    pt_y = y0 + (y1 - y0) * (recorte.min_vx - x0) / (x1 - x0)
	    posicao = "esq"
	}
	else if (codigo & dir) {
	    pt_x = recorte.max_vx
	    pt_y = y0 + (y1 - y0) * (recorte.max_vx - x0) / (x1 - x0)
	    posicao = "dir"
	}
	else if (codigo & topo) {
	    pt_x = x0 + (x1 - x0) * (recorte.max_vy - y0) / (y1 - y0)
	    pt_y = recorte.max_vy
	    posicao = "topo"
	}
	else {
	    pt_x = x0 + (x1 - x0) * (recorte.min_vy - y0) / (y1 - y0)
	    pt_y = recorte.min_vy
	    posicao = "base"
	}
	recortes.push({x: pt_x, y: pt_y, pos: posicao})
    }

    var pt_x, pt_y
    var codigo1 = codifica(x0, y0), codigo2 = codifica(x1, y1)

    pt_x = x0
    pt_y = y0
    while (codigo1 && !(codigo1 & codigo2)) {
	recorta_ponta(codigo1)
	codigo1 = codifica(pt_x, pt_y)
    }
    x0 = Math.round(pt_x)
    y0 = Math.round(pt_y)
    if (codigo1) { /* Reta fora da área de recorte, remove completamente. */
	return {}
    }

    cortes_origem = recortes.length

    pt_x = x1
    pt_y = y1
    while (codigo2) {
	recorta_ponta(codigo2)
	codigo2 = codifica(pt_x, pt_y)
    }
    /* Retorna novos pontos após terem sido recortados. */
    return {recortes: recortes, cortes_origem: cortes_origem,
	    x0: x0, y0: y0, x1: Math.round(pt_x), y1: Math.round(pt_y)}
}


/* A partir daqui todas as funções estão relacionadas com a animação do
 * recorte.
 */

recorte.outros.iniciar_animacao = function ()
{
    recorte.ainc = 0
    recorte.reta_index = 0
    recorte.recorte_index = 0
    recorte.step = 0
    recorte.temp_keyup = document.onkeyup
    document.onkeyup = recorte.outros.anim_avancar
    recorte.recortando = true

    var layer = document.getElementById("pixel-sel")
    layer.getContext("2d").clearRect(0, 0, layer.width, layer.height)
    linha.limpar()
    linha.desenhar_retas()
    recorte.outros.anim_preparar_avancar()
}

recorte.outros.anim_preparar_avancar = function ()
{
    recorte.cs1 = recorte.operacoes[recorte.ainc]
    if (recorte.cs1 == undefined) {
	//console.log("terminando", recorte.ainc)
	document.onkeyup = recorte.temp_keyup
	recorte.outros.clarear()
	return
    }

    recorte.lwidth = raster.conf.tamanho_pixel
    recorte.extra_lwidth = recorte.lwidth
    recorte.lwidth_inc = 0
    recorte.outros.anim_interval = setInterval(recorte.outros.destacar_reta,
					       100 / recorte.extra_lwidth + 5)
}

recorte.outros.anim_avancar = function (event)
{
    var event = window.event || event
    var key = event.keyCode

    if (key != 39 || !recorte.recortando) {
	return
    }

    /* Direita. Avançar. */
    recorte.step++

    var i = recorte.reta_index
    if (recorte.step == 2 || !recorte.cs1.recortes ||
	!recorte.cs1.recortes.length) {

	var h = recorte.cs1
	var recs = recorte.cs1.recortes

	if (recs) {
	    x0 = h.x0; y0 = h.y0; x1 = h.x1; y1 = h.y1
	    raster.selecionados[2*i] = raster.vpixels[y0][x0].index
	    raster.selecionados[2*i + 1] = raster.vpixels[y1][x1].index
	} else {
	    /* Reta deve ser completamente removida. */
	    var p1 = raster.selecionados.slice(0, 2*i)
	    var p2 = raster.selecionados.slice(2*i + 2)
	    raster.selecionados = p1.concat(p2)
	    recorte.reta_index--
	}

	var canvas = document.getElementById("recorte-animlinha")
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)

	recorte.step = 0
	recorte.recorte_index++
	/* recorte_index > recs.length no caso de retas que estão totalmente
	 * dentro da área de recorte. */
	if (!recs || recorte.recorte_index >= recs.length) {
	    clearInterval(recorte.outros.anim_interval)
	    recorte.ainc++
	    recorte.reta_index++
	    recorte.recorte_index = 0
	    recorte.outros.anim_preparar_avancar()
	}
    } else if (recorte.step == 1) {
	var r = recorte.cs1.recortes[recorte.recorte_index]

	var y = Math.round(r.y)
	var x = Math.round(r.x)

	if (recorte.recorte_index < recorte.cs1.cortes_origem) {
	    //console.log("origem novo")
	    raster.selecionados[2*i] = raster.vpixels[y][x].index
	    recorte.cs1.origem = raster.vpixels[y][x]
	} else {
	    //console.log("destino novo")
	    raster.selecionados[2*i + 1] = raster.vpixels[y][x].index
	    recorte.cs1.destino = raster.vpixels[y][x]
	}
    }

    var layer = document.getElementById("pixel-sel")
    layer.getContext("2d").clearRect(0, 0, layer.width, layer.height)
    linha.limpar()
    linha.desenhar_retas()
}

recorte.outros.selecionar_area = function(event)
{
    if (!linha.fechado || recorte.fechado)
	return

    /* Código igual aquele em raster.outros.selecionados, porém foi
       alterado para selecionar pontos da área de recorte. */

    var x_click = event.offsetX || event.layerX
    var y_click = event.offsetY || event.layerY
    var apagar = null

    /* Verificar se o clique do mouse atingiu algum pixel. */
    var pixel_index = raster.outros.click_to_pixel(x_click, y_click)
    if (pixel_index == null) {
	return
    }

    for (var i = 0; i < recorte.pontos_area.length; i++) {
        if (recorte.pontos_area[i] == pixel_index) {
            /* Desmarcar pixel. */
            apagar = i
            break
        }
    }

    if (apagar === null) {
	/* Seleciona novo pixel. */
	recorte.pontos_area.push(pixel_index)
    } else {
	/* Remove pixel. */
        var parte1 = recorte.pontos_area.slice(0, apagar)
        var parte2 = recorte.pontos_area.slice(apagar + 1)
        recorte.pontos_area = parte1.concat(parte2)
    }

    recorte.outros.atualizar_area_recorte()
}

recorte.outros.atualizar_area_recorte = function (event)
{
    var ctx = recorte.canvas.getContext("2d")
    var tam = recorte.pontos_area.length
    var origem, destino
    var temp = linha.ctx

    linha.ctx = ctx
    ctx.clearRect(0, 0, recorte.canvas.width, recorte.canvas.height)

    if (tam == 0) {
	return
    }

    if (tam == 1) {
	origem = raster.pixels[recorte.pontos_area[0]]
	linha.putpixel(origem.vx, origem.vy, "black")
	if (!event) {
	    recorte.canvas.onmousemove = recorte.outros.atualizar_area_recorte
	} else {
	    var x_pos = event.offsetX || event.layerX
	    var y_pos = event.offsetY || event.layerY
	    ctx.beginPath()
	    ctx.rect(origem.x, origem.y, x_pos - origem.x, y_pos - origem.y)
	    ctx.stroke()
	    ctx.closePath()
	}
    } else if (tam == 2) {
	recorte.canvas.removeEventListener("click",
					   recorte.outros.selecionar_area,
					   false)
	recorte.canvas.onmousemove = null

	origem = raster.pixels[recorte.pontos_area[0]]
	destino = raster.pixels[recorte.pontos_area[1]]

	if (origem.vx <= destino.vx) {
	    recorte.min_vx = origem.vx; recorte.max_vx = destino.vx
	    recorte.min_x = origem.x; recorte.max_x = destino.x
	} else {
	    recorte.min_vx = destino.vx; recorte.max_vx = origem.vx
	    recorte.min_x = destino.x; recorte.max_x = origem.x
	}
	/* O campo vy cresce de baixo para cima (igual no plano cartesiano),
	 * enquanto que o campo y cresce de cima para baixo (típico).
	 */
	if (origem.vy <= destino.vy) {
	    recorte.min_vy = origem.vy; recorte.max_vy = destino.vy
	    recorte.max_y = origem.y; recorte.min_y = destino.y
	} else {
	    recorte.min_vy = destino.vy; recorte.max_vy = origem.vy
	    recorte.max_y = destino.y; recorte.min_y = origem.y
	}

	/* Pinta os pixels da área de recorte. */
	var cor = "black"
	for (var x = recorte.min_vx; x <= recorte.max_vx; x++) {
	    linha.putpixel(x, origem.vy, cor)
	    linha.putpixel(x, destino.vy, cor)
	}
	for (var y = recorte.min_vy; y < recorte.max_vy; y++) {
	    linha.putpixel(origem.vx, y, cor)
	    linha.putpixel(destino.vx, y, cor)
	}

	recorte.outros.area_recorte_opacidade = 0
	recorte.interval = setInterval(recorte.outros.escurecer, 30)
    } else {
	console.log("BUG!", tam)
    }

    linha.ctx = temp
}

recorte.outros.destacar_reta = function ()
{
    var cs = recorte.cs1
    var canvas = document.getElementById("recorte-animlinha")
    var temp = linha.ctx

    linha.ctx = canvas.getContext("2d")
    linha.ctx.clearRect(0, 0, canvas.width, canvas.height)

    /* XXX Talvez tenha algum ganho significativo desenhar o retângulo
       seguinte em um canvas "estático". */
    if (cs && cs.recortes && cs.recortes.length) {
	linha.ctx.beginPath()
	linha.ctx.fillStyle = "rgba(255, 0, 0, 0.4)"
	switch (cs.recortes[recorte.recorte_index].pos) {
	case "esq":
	    linha.ctx.rect(0, 0, recorte.min_x, canvas.height)
	    break
	case "dir":
	    linha.ctx.rect(recorte.max_x, 0,
			   recorte.canvas.width - recorte.max_x,
			   recorte.canvas.height)
	    break
	case "topo":
	    linha.ctx.rect(0, 0, recorte.canvas.width, recorte.min_y)
	    break
	case "base":
	    linha.ctx.rect(0, recorte.max_y, recorte.canvas.width,
			   recorte.canvas.height - recorte.max_y)
	    break
	}
	linha.ctx.fill()
	linha.ctx.closePath()
    }

    if (recorte.lwidth >= (raster.conf.tamanho_pixel + recorte.extra_lwidth)) {
	recorte.lwidth_inc = -0.2
    } else if (recorte.lwidth <= raster.conf.tamanho_pixel) {
	recorte.lwidth_inc = 0.2
    }
    recorte.lwidth += recorte.lwidth_inc

    var temp2 = raster.conf.tamanho_pixel
    raster.conf.tamanho_pixel = recorte.lwidth
    linha.algoritmo_bresenham(cs.origem, cs.destino)
    raster.conf.tamanho_pixel = temp2

    linha.ctx = temp
}


/* Escurecer área ao redor da área de recorte. */
recorte.outros.escurecer = function ()
{
    var canvas = document.getElementById("recorte-anim")
    var ctx = canvas.getContext("2d")
    var opacity = recorte.outros.area_recorte_opacidade
    var fill_style = "rgba(0, 0, 0," + opacity + ")"

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()

    /* Esquerda */
    ctx.rect(0, 0, recorte.min_x, recorte.canvas.height)
    /* Topo */
    ctx.rect(0, 0, recorte.canvas.width, recorte.min_y)
    /* Base */
    ctx.rect(0, recorte.max_y, recorte.canvas.width,
	     recorte.canvas.height - recorte.max_y)
    /* Direita */
    ctx.rect(recorte.max_x, 0, recorte.canvas.width - recorte.max_x,
	     recorte.canvas.height)

    ctx.fillStyle = fill_style
    ctx.fill()
    ctx.closePath()

    recorte.outros.area_recorte_opacidade += 0.025
    if (recorte.outros.area_recorte_opacidade >= 0.4) {
	clearInterval(recorte.interval)
	/* Permitir que o recorte seja feito. */
	recorte.fechado = true
    }
}

/* Clarear área ao redor da área de recorte (inverso da função acima). */
recorte.outros.clarear = function()
{
    var interval, opacity = recorte.outros.area_recorte_opacidade

    function pintar()
    {
	var canvas = document.getElementById("recorte-anim")
	var ctx = canvas.getContext("2d")
	var fill_style = "rgba(0, 0, 0," + opacity + ")"

	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.beginPath()

	/* Esquerda */
	ctx.rect(0, 0, recorte.min_x, recorte.canvas.height)
	/* Topo */
	ctx.rect(0, 0, recorte.canvas.width, recorte.min_y)
	/* Base */
	ctx.rect(0, recorte.max_y, recorte.canvas.width,
		 recorte.canvas.height - recorte.max_y)
	/* Direita */
	ctx.rect(recorte.max_x, 0, recorte.canvas.width - recorte.max_x,
		 recorte.canvas.height)

	ctx.fillStyle = fill_style
	ctx.fill()
	ctx.closePath()

	opacity -= 0.025
	if (opacity <= 0) {
	    clearInterval(interval)
	    recorte.recortando = false
	    raster.outros.atualiza_selecao()
	}
    }

    interval = setInterval(pintar, 30)
}
