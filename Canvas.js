import React from 'react';
import Button from 'react-toolbox/lib/button/Button';
import correct_src from './correct.png';
import incorrect_src from './incorrect.png';
import Cookies from 'universal-cookie';
import $ from 'jquery';
import Constants from './Constants';


let redrawGraphView = () => drawView(null);
let table_content = "";

class Canvas extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            x: "",
            y: "",
            r: "",
            dots: []
        };
        this.createClickHandler = this.createClickHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        drawView(null);
    }

    handleChange(event) {
        const { name, value } = event.target;
        if(name==='r'){
            var check_r = checkVar(value, 'R', 0, 5);
            document.getElementById('error_r').innerText = check_r[0];
            if (check_r[1]) {
                drawView(value);
                const cookies = new Cookies();
                let token = cookies.get('token');
                $.ajax({
                    type: 'GET',
                    url: Constants.HOST+'/api/getDots',
                    data: { token: token},
                    success: function (jqXHR, textStatus, errorThrown) {
                        setTableData(jqXHR);
                        for (let index = 0; index < jqXHR.length; index++) {
                            const point = jqXHR[index];
                            const graph = document.getElementById('graph');
                            const context = graph.getContext('2d');

                            drawPoint(+(value.replace(",", ".")), context, { x: point.x, y: point.y, r: +(value.replace(",", ".")), popadanie: point.popadanie });
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                    },
                });
            }else{
                drawView(null);
            }
        }
        this.setState({
            [name]: value
        });
    }
    createClickHandler(event) {
        const { x, y, r } = this.state;
        event.preventDefault();

        var check_r = checkVar(r, 'R', 0, 5);
        var check_x = checkVar(x, 'X', -3, 5);
        var check_y = checkVar(y, 'Y', -5, 5);

        document.getElementById('error_x').innerText = check_x[0];
        document.getElementById('error_y').innerText = check_y[0];
        document.getElementById('error_r').innerText = check_r[0];

        if (check_r[1]) {
            const cookies = new Cookies();
            let token = cookies.get('token');
            drawView(r);
            if (check_x[1] && check_y[1]) {
                $.ajax({
                    type: 'POST',
                    url: Constants.HOST+'/api/sendDot',
                    data: { token: token, x: x, y: y, r: r },
                    success: function (jqXHR, textStatus, errorThrown) {
                        setTableData(jqXHR);
                        for (let index = 0; index < jqXHR.length; index++) {
                            const point = jqXHR[index];
                            const graph = document.getElementById('graph');
                            const context = graph.getContext('2d');

                            drawPoint(+(r.replace(",", ".")), context, { x: point.x, y: point.y, r: +(r.replace(",", ".")), popadanie: point.popadanie });
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                    },
                });

            }else{
                $.ajax({
                    type: 'GET',
                    url: Constants.HOST+'/api/getDots',
                    data: { token: token},
                    success: function (jqXHR, textStatus, errorThrown) {
                        setTableData(jqXHR);
                        for (let index = 0; index < jqXHR.length; index++) {
                            const point = jqXHR[index];
                            const graph = document.getElementById('graph');
                            const context = graph.getContext('2d');

                            drawPoint(+(r.replace(",", ".")), context, { x: point.x, y: point.y, r: +(r.replace(",", ".")), popadanie: point.popadanie });
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                    },
                });
            }
        }

    }


    render() {
        const { x, y, r } = this.state;

        return (
            <table id="g_rable" style={{ margin: 'auto'},{alignContent:'center'}}>
                <tr><canvas align="center"  style={{ margin: 'auto' }} id="graph" width="500" height="500" class="graph-view" ></canvas></tr>
                <tr>
                    <section>
                        <div class="form" >
                            <form>
                                <label for="x">X</label>
                                <p class="error" id="error_x" style={{ color: "red" }}></p>
                                <input
                                    type="text"
                                    name="x"
                                    id="x"
                                    onChange={this.handleChange}
                                    placeholder="(-3...5)"
                                    maxlength="17"
                                    required
                                />
                                <label for="y">Y</label>
                                <p class="error" id="error_y" style={{ color: "red" }}></p>
                                <input
                                    type="y"
                                    name="y"
                                    id="y"
                                    placeholder="(-5...5)"
                                    maxlength="17"
                                    onChange={this.handleChange}
                                    required
                                />
                                <label for="r">R</label>
                                <p class="error" id="error_r" style={{ color: "red" }}></p>
                                <input
                                    type="r"
                                    name="r"
                                    id="r"
                                    placeholder="(-3...5)"
                                    onChange={this.handleChange}
                                    maxlength="17"
                                    required
                                />
                                <Button label="Отправить" align="center" onClick={this.createClickHandler} />



                            </form>
                        </div>
                    </section>

                </tr>

                <tr>
                    <table id="table" cellspacing="2" border="1" cellpadding="5" align="center" width="100%"/>
                </tr>
            </table>

        );
    }
}

function checkPopadanie(x,y,r) {
    if (x < 0 && y < 0) {
        return false;
    } else if (x > 0 && y <= 0) {
        return y > -r && x < r / 2;
    } else if (x <= 0 && y > 0) {
        return x * x + y * y < r * r;
    } else if (x >= 0 && y >= 0) {
        return y < (-x / 2 + r / 2);
    }
    return false;
}

function checkVar(x, name, min, max) {
    x = x.replace(',', '.');

    if (x.length === 0) {
        return ["Параметр " + name + " не выбран", false];
    }

    if (isNaN(+x)) {
        return [name + " не является числом", false];
    }

    let val = +x;
    if (val <= min || val >= max) {
        return [name + ` выходит за границы интервала (${min}, ${max})`, false];
    }

    return ['', true];

}

function setTableData(dots) {
    const table = document.getElementById('table');
    var html = `<tr><td>X</td><td>Y</td><td>R</td><td>ПОПАДАНИЕ</td></tr>`;
    for(let index = dots.length - 1; index >= 0; index--){
        const dot = dots[index];
        html = html + `<tr><td>` + dot.x + `</td><td>` + dot.y + `</td><td>` + dot.r + `</td><td>` + dot.popadanie + `</td></tr>`;
    }
    table.innerHTML = html;
}
function drawView(r) {
    const graph = document.getElementById('graph');
    const context = graph.getContext('2d');

    context.clearRect(0, 0, graph.width, graph.height);
    //круг
    context.beginPath();
    context.moveTo(250, 250);
    context.arc(250, 250, 230, Math.PI, -Math.PI / 2);
    context.closePath();
    context.strokeStyle = "#39f";
    context.fillStyle = "#39f";
    context.fill();
    context.stroke();

    //прямоугольник
    context.beginPath();
    context.rect(250, 250, 115, 230);
    context.closePath();
    context.strokeStyle = "#39f";
    context.fillStyle = "#39f";
    context.fill();
    context.stroke();


    //треугольник
    context.beginPath();
    context.moveTo(250, 250);
    context.lineTo(480, 250);
    context.lineTo(250, 135);
    context.closePath();
    context.strokeStyle = "#39f";
    context.fillStyle = "#39f";
    context.fill();
    context.stroke();


    //оси
    context.strokeStyle = "black";
    context.fillStyle = "black";
    context.beginPath();
    context.font = "14px Courier New";
    context.moveTo(250, 0);
    context.lineTo(250, 500);
    context.moveTo(250, 0);
    context.lineTo(245, 15);
    context.moveTo(250, 0);
    context.lineTo(255, 15);
    context.fillText("Y", 260, 10);
    context.moveTo(0, 250);
    context.lineTo(500, 250);
    context.moveTo(500, 250);
    context.lineTo(485, 245);
    context.moveTo(500, 250);
    context.lineTo(485, 255);
    context.fillText("X", 490, 235);

    // деления
    const R = r == null ? "R" : r;
    const halfR = r == null ? "R/2" : +(r.replace(",", ".")) / 2;

    context.moveTo(245, 20);
    context.lineTo(255, 20);
    context.fillText(R, 255, 25);
    context.moveTo(245, 135);
    context.lineTo(255, 135);
    context.fillText(halfR, 255, 140);
    context.moveTo(245, 365);
    context.lineTo(255, 365);
    context.fillText(`-${halfR}`, 255, 370);
    context.moveTo(245, 480);
    context.lineTo(255, 480);
    context.fillText(`-${R}`, 255, 485);
    context.moveTo(20, 245);
    context.lineTo(20, 255);
    context.fillText(`-${R}`, 15, 240);
    context.moveTo(135, 245);
    context.lineTo(135, 255);
    context.fillText(`-${halfR}`, 130, 240);
    context.moveTo(365, 245);
    context.lineTo(365, 255);
    context.fillText(halfR, 360, 240);
    context.moveTo(480, 245);
    context.lineTo(480, 255);
    context.fillText(R, 475, 240);

    context.closePath();
    context.strokeStyle = "black";
    context.fillStyle = "black";
    context.stroke();

    drawPoints(r, graph, context);
    redrawGraphView = () => drawView(r);

    if (r != null) {
        graph.onclick = (event) => {

            const rect = graph.getBoundingClientRect();
            const visualX = Math.floor(event.clientX - rect.left);
            const visualY = Math.floor(event.clientY - rect.top);

            const centerX = 250;
            const centerY = 250;
            const zoomX = 230 / +(r.replace(",", "."));
            const zoomY = 230 / +(r.replace(",", "."));


            let self = this;
            const cookies = new Cookies();
            let token = cookies.get('token');

            $.ajax({
                type: 'POST',
                url: Constants.HOST+'/api/sendDot',
                data: { token: token, x: (visualX - centerX) / zoomX, y: (centerY - visualY) / zoomY, r: +(r.replace(",", ".")) },
                success: function (jqXHR, textStatus, errorThrown) {
                    setTableData(jqXHR);
                    for (let index = 0; index < jqXHR.length; index++) {
                        const point = jqXHR[index];
                        const graph = document.getElementById('graph');
                        const context = graph.getContext('2d');
                        drawPoint(+(r.replace(",", ".")), context, { x: point.x, y: point.y, r: +(r.replace(",", ".")), popadanie: point.popadanie });
                    }

                    table_content = "fgh<br>fgh<br>";
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                },
            });

        };
    }
}

const correctImg = new Image();
const incorrectImg = new Image();

correctImg.src = correct_src;
incorrectImg.src = incorrect_src;
let points = [];

function drawPoints(r, canvas, context) {
    const centerX = 250;
    const centerY = 250;

    if (r != null) {
        const zoomX = 230 / r;
        const zoomY = 230 / r;

        points.forEach((point) => {
            if (point.r !== r) {
                return;
            }

            const visualX = centerX + point.x * zoomX;
            const visualY = centerY - point.y * zoomY;
            if (checkPopadanie(point.x, point.y, point.r)) {
                context.drawImage(correctImg, visualX - 7, visualY - 7, 14, 14);
            } else context.drawImage(incorrectImg, visualX - 7, visualY - 7, 14, 14);
        });
    } else {
        points.forEach((point) => {
            const zoomX = 230 / point.r;
            const zoomY = 230 / point.r;

            const visualX = centerX + point.x * zoomX;
            const visualY = centerY - point.y * zoomY;
            if (checkPopadanie(point.x, point.y, point.r)) {
                context.drawImage(correctImg, visualX - 7, visualY - 7, 14, 14);
            } else context.drawImage(incorrectImg, visualX - 7, visualY - 7, 14, 14);
        });
    }
}

function drawPoint(r, context, point) {
    const centerX = 250;
    const centerY = 250;


    if (r != null) {
        const zoomX = 230 / r;
        const zoomY = 230 / r;


        if (point.r !== r) {
            return;
        }

        const visualX = centerX + point.x * zoomX;
        const visualY = centerY - point.y * zoomY;
        if (checkPopadanie(point.x, point.y, point.r)) {
            context.drawImage(correctImg, visualX - 7, visualY - 7, 14, 14);
        } else context.drawImage(incorrectImg, visualX - 7, visualY - 7, 14, 14);

    } else {

        const zoomX = 230 / point.r;
        const zoomY = 230 / point.r;

        const visualX = centerX + point.x * zoomX;
        const visualY = centerY - point.y * zoomY;
        if (checkPopadanie(point.x, point.y, point.r)) {
            context.drawImage(correctImg, visualX - 7, visualY - 7, 14, 14);
        } else context.drawImage(incorrectImg, visualX - 7, visualY - 7, 14, 14);

    }
}
export default Canvas;