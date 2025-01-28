import { GraphicsApi } from "@app/profiles/types";

export const getApiLaunchArgument = (api: GraphicsApi): string => {
    switch(api) {
        case GraphicsApi.Default:
            return "";
        case GraphicsApi.D3D11:
            return "-force-d3d11";
        case GraphicsApi.D3D12:
            return "-force-d3d12";
        case GraphicsApi.OPEN_GL:
            return "-force-glcore";
        case GraphicsApi.VULKAN:
            return "-force-vulkan";
        case GraphicsApi.METAL:
            return "-force-metal";
    }
};