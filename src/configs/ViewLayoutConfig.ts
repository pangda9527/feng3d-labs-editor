namespace editor
{
    export var viewLayoutConfig = {
        default: {
            "x": 0,
            "y": 0,
            "width": 1440,
            "height": 712,
            "percentWidth": null,
            "percentHeight": null,
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "type": "SplitGroup",
            "layout": "HorizontalLayout",
            "children": [
                {
                    "x": 0,
                    "y": 0,
                    "width": 1186,
                    "height": 712,
                    "percentWidth": 100,
                    "percentHeight": 100,
                    "top": null,
                    "bottom": null,
                    "left": null,
                    "right": null,
                    "type": "SplitGroup",
                    "layout": "VerticalLayout",
                    "children": [
                        {
                            "x": 0,
                            "y": 0,
                            "width": 1186,
                            "height": 458,
                            "percentWidth": 100,
                            "percentHeight": 100,
                            "top": null,
                            "bottom": null,
                            "left": null,
                            "right": null,
                            "type": "SplitGroup",
                            "layout": "HorizontalLayout",
                            "children": [
                                {
                                    "x": 0,
                                    "y": 0,
                                    "width": 234,
                                    "height": 458,
                                    "percentWidth": 19.73018549747049,
                                    "percentHeight": 100,
                                    "top": null,
                                    "bottom": null,
                                    "left": null,
                                    "right": null,
                                    "type": "TabView",
                                    "modules": [
                                        "Hierarchy"
                                    ]
                                },
                                {
                                    "x": 238,
                                    "y": 0,
                                    "width": 948,
                                    "height": 458,
                                    "percentWidth": 79.93254637436762,
                                    "percentHeight": 100,
                                    "top": null,
                                    "bottom": null,
                                    "left": null,
                                    "right": null,
                                    "type": "TabView",
                                    "modules": [
                                        "Scene"
                                    ]
                                }
                            ]
                        },
                        {
                            "x": 0,
                            "y": 462,
                            "width": 1186,
                            "height": 250,
                            "percentWidth": 100,
                            "percentHeight": null,
                            "top": null,
                            "bottom": null,
                            "left": null,
                            "right": null,
                            "type": "TabView",
                            "modules": [
                                "Project"
                            ]
                        }
                    ]
                },
                {
                    "x": 1190,
                    "y": 0,
                    "width": 250,
                    "height": 712,
                    "percentWidth": null,
                    "percentHeight": 100,
                    "top": null,
                    "bottom": null,
                    "left": null,
                    "right": null,
                    "type": "TabView",
                    "modules": [
                        "Navigation",
                        "Inspector"
                    ]
                }
            ]
        }
    }
}