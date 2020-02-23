import statesDotFile from "./states.dot"

export interface ConfigItem {
    StateFrom: string
    StateTo: string
    Transition: string
}

export class Config {
    load(): ConfigItem[] {
        let configItems = [] as ConfigItem[];
        const configString = statesDotFile;
        const regex = /(?<FromState>"*[a-zA-Z ]*"*)\s*->\s*(?<ToState>"*[a-zA-Z ]*"*)\s*\[\s*label\s*=\s*(?<Transition>"*[a-zA-Z ]*"*)\s*]/gm;
        let m;

        configString.split('\n').forEach((line) => {
            let item = this.extractConfigItem(m, regex, line);
            if (item.StateFrom !== "" && item.StateTo !== "" && item.Transition !== "") {
                configItems.push(item);
            }
        });

        return configItems;
    }

    private extractConfigItem(m, regex: RegExp, line: string) {
        let item = {StateFrom: "", StateTo: "", Transition: ""} as ConfigItem;

        while ((m = regex.exec(line)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            m.forEach((match, groupIndex) => {
                let value = match.replace(/"/g, ``);
                switch (groupIndex) {
                    case 1:
                        item.StateFrom = value;
                        break;
                    case 2:
                        item.StateTo = value;
                        break;
                    case 3:
                        item.Transition = value;
                        break;
                }
            });
        }
        return item;
    }
}
