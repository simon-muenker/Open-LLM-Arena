export interface Model {
    name: string;
    url: string;
    size: number;
}

export const MODELS: Array<Model> = [
	{
		name: "GLM 4.7",
		url: "zai-org/GLM-4.7",
		size: 358
	},
	{
		name: "MiniMax 2.1",
		url: "MiniMaxAI/MiniMax-M2.1",
		size: 229
	},
	{
		name: "Ministral 3",
		url: "mistralai/Ministral-3-14B-Instruct-2512",
		size: 14
	},
	{
		name: "Ministral 3",
		url: "mistralai/Ministral-3-8B-Instruct-2512",
		size: 8
	},
	{
		name: "Qwen 3",
		url: "Qwen/Qwen3-VL-8B-Instruct",
		size: 8
	},
	{
		name: "Qwen 3",
		url: "Qwen/Qwen3-VL-4B-Instruct",
		size: 4
	}
]
