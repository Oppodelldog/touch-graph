export interface ConfigItem {
    StateFrom: string
    StateTo: string
    Transition: string
}

export class Config {
    public load(): ConfigItem[] {
        let configItems = [] as ConfigItem[];

        const configString = `
digraph {
    "Idle"         -> "Touched"      [ label = "Touch Start" ]
    "Touched"      -> "Move Diagram" [ label = "Touch Move on Diagram" ]
    "Touched"      -> "Move Node"    [ label = "Touch Move on Node" ]
    "Touched"      -> "Move Port"    [ label = "Touch Move on Port" ]
    "Touched"      -> "Pinch Zoom"   [ label = "Double Touch Move" ]
    "Touched"      -> "Idle"         [ label = "Touch End" ]
    "Move Diagram" -> "Pinch Zoom"   [ label = "Double Touch Move" ]
    "Move Diagram" -> "Idle"         [ label = "Release Diagram" ]
    "Move Node"    -> "Pinch Zoom"   [ label = "Double Touch Move" ]
    "Move Node"    -> "Idle"         [ label = "Release Node" ]
    "Move Port"    -> "Pinch Zoom"   [ label = "Double Touch Move" ]
    "Move Port"    -> "Idle"         [ label = "Release Port" ]
    "Pinch Zoom"   -> "Touched"      [ label = "Touch End" ]

    "Idle" -> "Mouse Zooming" [ label = "Use Mousewheel" ]
    "Mouse Zooming" -> "Idle" [ label = "Zoom finished" ]

    "Idle" -> "Adjusting Focus" [ label = "Double Click" ]
    "Adjusting Focus" -> "Idle" [ label = "Focus adjustment finished" ]

    "Idle" -> "Selecting Nodes" [ label = "Select Node" ]
    "Selecting Nodes" -> "Idle" [ label = "Single Selection Return" ]

    "Idle" -> "Selecting multiple Nodes" [ label = "Turn on multi selection" ]
    "Selecting multiple Nodes" -> "Selecting multiple Nodes" [ label = "Select one more Node" ]
    "Selecting multiple Nodes" -> "Selecting multiple Nodes" [ label = "Deselect one Node" ]
    "Selecting multiple Nodes" -> "Idle" [ label = "Turn off multi selection" ]

    "Idle" -> "Deleting Selected Nodes" [ label = "Delete Nodes" ]
    "Deleting Selected Nodes" -> "Idle" [ label = "Nodes Deleted" ]
}
        `;
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
