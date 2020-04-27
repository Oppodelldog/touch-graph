export declare class Diagram {
    xOffset: number;
    yOffset: number;
    grabbed: boolean;
    grabbedAt: {
        x: number;
        y: number;
    };
    xDrag: number;
    yDrag: number;
    constructor();
    dragStart(x: any, y: any): void;
    dragMove(x: any, y: any): void;
    dragStop(): void;
}
