export interface ConfigItem {
    StateFrom: string;
    StateTo: string;
    Transition: string;
}
export declare class Config {
    load(): ConfigItem[];
    private extractConfigItem;
}
