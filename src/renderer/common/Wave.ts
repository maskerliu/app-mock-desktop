export class Wave {
    private context: CanvasRenderingContext2D;

    private width: number;
    private height: number;

    private midX: number;
    private midY: number;

    private count: number;
    private steps: number;
    private tick: number;
    private data: Array<{ x: number, y: number, d: number }>;

    constructor(context: CanvasRenderingContext2D, sizeX: number, sizeZ: number) {
        this.context = context;

        this.width = sizeX;
        this.height = sizeZ;

        this.midX = this.width / 2;
        this.midY = this.height / 2;

        this.count = 50;
        this.steps = 30;
        this.tick = 0;

        this.initData();
    }

    initData() {
        this.data = [];
        let sRel: number, sMax: number, r: number;
        for (let s = 0; s < this.steps; s++) {

            sRel = s / this.steps;
            sMax = sRel * this.count;

            for (let i = 0; i < sMax; i++) {
                r = (Math.random() - 0.5) * i / sMax / 10;
                this.data.push({
                    x: Math.cos(r + i / sMax * Math.PI * 2) * sRel,
                    y: Math.sin(r + i / sMax * Math.PI * 2) * sRel,
                    d: sRel
                });
            }
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    render() {
        this.clear();
        this.tick--;

        this.data.forEach((point) => {
            // const h  = Math.sin(this.tick * 0.1 + point.d * (Math.sin(this.tick * 0.05) + 1) * 2);
            const h = Math.sin(this.tick * 0.1 + point.d * 7.5);
            const hl = Math.sin(this.tick * 0.12 + point.d * 7.5);
            const hs = h * this.height * 0.1;
            const s = 0.5 + (point.y + 1) * 2;

            this.context.fillStyle = `hsla(${180 + hl * 180 | 0}, 70%, ${25 + (h * -1) * 25 | 0}%, ${0.5 + (h * -1) * 0.5})`;

            this.context.beginPath();
            this.context.arc(
                this.midX + point.x * this.width * 0.3,
                this.midY + point.y * this.width * 0.1 + hs,
                1.5 * s,
                0,
                Math.PI * 2
            );
            this.context.fill();
            this.context.closePath();
        });

        window.requestAnimationFrame(this.render.bind(this));
    }

    run() {
        this.render();
    }
}