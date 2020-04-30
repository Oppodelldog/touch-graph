export declare class Diagram {
    grabbed: boolean;
    grabbedAt: {
        x: number;
        y: number;
    };
    constructor();
    dragStart(x: any, y: any): void;
    getDraggedOffset(x: any, y: any): {
        x: number;
        y: number;
    };
    dragStop(): void;
}
