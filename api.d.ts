/**
 * Material properties, references:
 * - pbr: https://docs.cocos.com/creator/manual/zh/shader/effect-builtin-pbr.html#pbr-%E5%8F%82%E6%95%B0
 * - toon: https://docs.cocos.com/creator/manual/zh/shader/effect-builtin-toon.html#%E5%8F%82%E6%95%B0%E5%92%8C%E9%A2%84%E7%BC%96%E8%AF%91%E5%AE%8F%E5%AE%9A%E4%B9%89
 * - shaded: https://docs.cocos.com/creator/manual/zh/shader/effect-builtin-unlit.html#%E5%8F%82%E6%95%B0
 */
export interface RodinMaterialProperties {
    roughness: number;
    metallic: number;
}
/**
 * RodinMaterial including:
 * - Material name
 * - Textures
 * - A reference to the `RodinMaterialProperties`
 */
export interface RodinMaterial {
    name: string;
    material?: Material;
    mainTexture?: string | Texture2D;
    albedoMap?: string | Texture2D;
    pbrMap?: string | Texture2D;
    normalMap?: string | Texture2D;
    baseColorMap?: string | Texture2D;
    properties?: RodinMaterialProperties;
}
/**
 * RodinAsset including:
 * - name: The asset name and loaded Node name
 * - host: The host for remote assets, will be used as prefix for the asset url
 * - url: glTF asset url
 * - materials: An array of `RodinMaterial` info
 */
export interface RodinAsset {
    name: string;
    host: string;
    url: string;
    materials: RodinMaterial[];
}
/**
 * Handle remote loading of Rodin assets and material setups
 * Can be accessed globally as `window.remoteLoader`
 */
export declare class RemoteLoader extends Component {
    /**
     * Materials supported by the loader
     */
    materials: Material[];
    /**
     * The host string to use for remote assets, if not provided in the asset
     * It will retrieve `host` from the url query string
     */
    host: string;
    /**
     * Indicates whether the loader is currently loading an asset
     */
    loading: boolean;
    private _data;
    private _loader;
    private _model;
    private _renderer;
    private _wireFrame;
    private _quadMesh;
    private _mtlCtrls;
    start(): void;
    reset(): void;
    /**
     * Load an GLTF asset from a remote URL
     * @param url asset url
     * @param name name of the loaded Node
     * @param cb Callback while asset loaded
     * @param mtlConfig Properties of the material in form of JS Object, e.g. { roughness: 0.5, metallic: 0.5 }
     * @returns Whether the request is proceeded or ignored
     */
    loadGLTF(url: string, name: string, cb: (node: Node, renderer: MeshRenderer, backColor?: Color, edgeColor?: Color) => void, mtlConfig?: any): boolean;
    /**
     * Load a Rodin asset with RodinAsset description
     * @param asset The `RodinAsset` info object
     * @param cb Callback while asset loaded, with `Node` and `MeshRenderer` component as parameters
     * @returns Whether the request is proceeded or ignored
     */
    loadRodinAsset(asset: RodinAsset, cb?: (node: Node, renderer: MeshRenderer, backColor?: Color, edgeColor?: Color) => void): boolean;
    /**
     * Post update a `RodinAsset` with material textures and properties in `RodinMaterial` info array
     * It will directly affect the material of the loaded model
     * @param updates The updated info of `RodinMaterial`
     */
    updateMaterial(updates: RodinMaterial[]): void;
    /**
     * Switch material of the loaded model, supported materials
     * - pbr
     * - toon
     * - shaded
     * - blank
     * @param name name of the material
     */
    switchMaterial(name: string): void;
    /**
     * Enable quad wire frame rendering or not
     * @param enabled
     */
    enableWireFrame(enabled: boolean): void;
    /**
     * Set line width of the toon material, only works when the current material is toon
     * @param width Width in points
     */
    setLineWidth(width: number): void;
}

/**
 * The settings of the model viewer, including
 * - Environment: Sky box or color background
 * - Materials: PBR, Toon, Shaded, Blank
 * - PostProcesses: Bloom, Ambient Occlusion, Vignette
 * Can be accessed globally as `window.settings`
 */
export declare class Settings extends Component {
    /**
     * The remote loader to load Rodin assets, same object as `window.remoteLoader`
     */
    loader: RemoteLoader;
    /**
     * The post process node with all related components: bloom, ambient occlusion, blit screen (vignette)
     */
    postProcess: Node;
    /**
     * The light node to control the light direction
     */
    light: Node;
    /**
     * The sphere renderer wrapping model object for controlling the background color
     * Use `setColorBackground(color: Color)` will be easier
     */
    sphere: MeshRenderer;
    /**
     * The json asset containing the Rodin assets preset
     * No need to use it for remote assets
     */
    assets: JsonAsset;
    /**
     * Load `RodinAsset`.
     * The difference with `remoteLoader.loadRodinAsset` is that it will also update the settings menu and setup the background color if available in the GLTF extension
     * @param asset
     * @returns Whether the request is proceeded or ignored
     */
    loadRodinAsset(asset: RodinAsset): boolean;
    /**
     * Set angles of directional light, suggested range
     * - x: -180 ~ 0
     * - y: FIXED at 90, cannot be over written
     * - z: 0 ~ 90
     * @param eulerAngles
     */
    setLightDirection(eulerAngles: Vec3): void;
    /**
     * Activate the sky box
     * Currently no sky box is loaded so please don't use it
     */
    setEnvironment(): void;
    /**
     * Setup the background color e.g. `settings.setColorBackground(new cc.Color(r, g, b, a));`
     * @param color The `cc.Color` object, RGBA value is from 0 - 255
     */
    setColorBackground(color: Color): void;
    /**
     * Setup environment setups including sky box, ambient, shadows and post processes
     * @param enabled 
     */
    setBlankScene (enabled: boolean): void;
    /**
     * Enable or disable the bloom post process
     * @param enabled
     */
    enableBloom(enabled: boolean): void;
    /**
     * Enable or disable the ambient occlusion post process
     * @param enabled
     */
    enableAO(enabled: boolean): void;
    /**
     * Enable or disable the vignette post process
     * @param enabled
     */
    enableVignette(enabled: boolean): void;
}

/**
 * The camera controller of the model viewer, it always looks at the target node while provides the rotating and scaling abilities on desktop and mobile
 * Can be accessed with `window.cameraController`
 */
export declare class RodinController extends Component {
    /**
     * The damping factor for scaling and rotating, each time span will be divided by this factor
     * The smaller it is, the slower the movement will be
     */
    damping: number;
    /**
     * Speed factor of zooming
     */
    zoomSpeed: number;
    mouse_constant: number;
    /**
     * The target node which the camera is looking at
     */
    target: Node | null;
    /**
     * The maximum distance of the object from the camera.
     */
    maxRadius: number;
    /**
     * The minimum distance of the object from the camera.
     */
    minRadius: number;
    private _minPolar;
    private _maxPolar;
    /**
     * The minimum polar angle in degrees.
     */
    get minPolar(): number;
    set minPolar(value: number);
    /**
     * The maximum polar angle in degrees.
     */
    get maxPolar(): number;
    set maxPolar(value: number);
    maxAzimuth: any;
    minAzimuth: any;
    /**
     * The azimuthal angle in radians.
     */
    get azimuth(): any;
    set azimuth(value: any);
    /**
     * The polar angle in radians, 0 is at the top.
     */
    get polar(): any;
    set polar(e: any);
    /**
     * The distance from the camera to the target node.
     */
    get radius(): any;
    set radius(value: any);

    /**
     * Handle event outside of the canvas, it's listening window mousemove event.
     * It can be called manually but the MouseEvent's clientX and clientY must be relative to the window (top-left) of the canvas.
     * @param e MouseEvent
     */
    public windowMouseMove (e: MouseEvent): void;
}
