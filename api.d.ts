/**
 * Material properties, references:
 * - pbr: https://docs.cocos.com/creator/manual/zh/shader/effect-builtin-pbr.html#pbr-%E5%8F%82%E6%95%B0
 * - toon: https://docs.cocos.com/creator/manual/zh/shader/effect-builtin-toon.html#%E5%8F%82%E6%95%B0%E5%92%8C%E9%A2%84%E7%BC%96%E8%AF%91%E5%AE%8F%E5%AE%9A%E4%B9%89
 * - shaded: https://docs.cocos.com/creator/manual/zh/shader/effect-builtin-unlit.html#%E5%8F%82%E6%95%B0
 */
export interface RodinMaterialProperties {
    roughness: number;
    metallic: number;
    albedoScale: Vec3;
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
     * The base color for the blank material
     */
    get blankColor(): Color;
    set blankColor(val: Color);
    /**
     * The wire color for rendering the wire frame
     */
    get wireColor(): Color;
    set wireColor(val: Color);
    /**
     * The depth bias for the wire frame material, it will affect wire's render quality.
     * Smaller it is, the wire will be closer to the model, it might be less visible, but more accurate.
     * Bigger it is, the wire will be closer to the camera, it might be more visible, but less accurate, user could see some back wires in some corner cases.
     * The suggested value is from 0.001 to 0.00001
     */
    get wireDepthBias(): number;
    set wireDepthBias(val: number);
    /**
     * The host string to use for remote assets, if not provided in the asset
     * It will retrieve `host` from the url query string
     */
    host: string;
    /**
     * Indicates whether the loader is currently loading an asset
     */
    loading: boolean;

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
    loadGLTF(url: string, name: string, cb: (node: Node, loadedRenderer: LoadedRenderer, backColor?: Color, edgeColor?: Color) => void, mtlConfig?: any): boolean;
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
    private genAlternativeMeshes;
}

/**
 * API interface for Bloom component in post process.
 * Could be used for `settings.bloom`
 */
export interface IBloom extends Component {
    /**
     * Enable or disable the bloom effect
     */
    enabled: boolean;
    /**
     * The intensity of the bloom effect
     */
    intensity: number;
    /**
     * The highlight threshold to enabling the bloom effect
     */
    threshold: number;
    /**
     * Iteration count for the bloom effect, should be 1 ~ 3
     */
    iterations: number;
}
/**
 * API interface for Ambient Occlusion component in post process
 * Could be used for `settings.ao`
 */
export interface IAmbientOcclusion extends Component {
    /**
     * Enable or disable the ambient occlusion effect
     */
    enabled: boolean;
    /**
     * The radius of the occluded area
     */
    radiusScale: number;
    /**
     * The color saturation of the occluded area
     */
    aoSaturation: number;
    /**
     * Whether the edge of the ambient occlusion should be blurred
     */
    needBlur: boolean;
}
/**
 * The settings of the model viewer, including
 * - Environment: Sky box or color background
 * - Materials: PBR, Toon, Shaded, Blank
 * - PostProcesses: Bloom, Ambient Occlusion, Vignette
 * Can be accessed globally as `window.settings`
 */
export declare class Settings {
    static instance: Settings;
    /**
     * The time records for the loading process
     */
    timeRecords: {
        INIT_PREVIEW: number;
        PAGE_LOAD: number;
        SCRIPT_LOAD: number;
        ENGINE_INIT: number;
        SCENE_LOAD: number;
        MODEL_REQUEST: number;
        MODEL_DOWNLOAD: number;
        MODEL_PARSE: number;
        MATERIAL_INIT: number;
        MESH_GENERATE: number;
        MODEL_LOAD_FINISH: number;
        FRAME_RENDER: number;
    };
    /**
     * The remote loader to load Rodin assets, same object as `window.remoteLoader`
     */
    loader: RemoteLoader;
    /**
     * The post process node with all related components: bloom, ambient occlusion, blit screen (vignette)
     */
    postProcess: Node;
    /**
     * The sphere renderer wrapping model object for controlling the background color
     * Use `setColorBackground(color: Color)` will be easier
     */
    camera: Camera;
    /**
     * The light node to control the light direction
     */
    light: Node;
    /**
     * The bloom component of the post process
     */
    bloom: IBloom;
    /**
     * The ambient occlusion component of the post process
     */
    ao: IAmbientOcclusion;
    /**
     * The light direction in Euler angles
     * @readonly
     */
    get lightDirection(): Vec3;
    /**
     * The background color of the blank scene
     * @readonly
     */
    get backColor(): Color;
    /**
     * Whether the bloom post effect is enabled
     * @readonly
     */
    get bloomEnabled(): boolean;
    /**
     * Whether the ambient occlusion post effect is enabled
     * @readonly
     */
    get aoEnabled(): boolean;
    /**
     * Whether the vignette post effect is enabled
     * @readonly
     */
    get vignetteEnabled(): boolean;

    init(loader: RemoteLoader, postProcess: Node, camera: Camera, light?: Node, canvas?: Node, menuPrefab?: string): void;
    /**
     * To pass the preview page request time to the settings.timeRecords.
     * @param initTimeInMS The time when the preview page is initialized in the outer window, measured in milliseconds.
     */
    recordInitTime(initTimeInMS: number): void;
    /**
     * Log the time records in the console
     */
    logTimeRecords(): void;
    /**
     * Enable or disable the settings menu UI, disabled by default
     * @param enabled
     */
    enableMenu(enabled: boolean): void;
    /**
     * Load `RodinAsset`.
     * The difference with `remoteLoader.loadRodinAsset` is the following
     * 1. Switch the model's material to blank material
     * 2. Update the environment settings for blank material
     * 3. Setup the background color if available in the GLTF extension
     * @param asset The rodin asset to be loaded
     * @param cb The callback invoked after the asset is loaded, can be used to do extra setup
     * @returns Whether the request is proceeded or ignored
     */
    loadRodinAsset(asset: RodinAsset, cb?: (node: Node, renderer: MeshRenderer, backColor?: Color, edgeColor?: Color) => void): boolean;
    /**
     * Set angles of directional light, suggested range
     * - x: -180 ~ 0
     * - y: FIXED at 90, cannot be over written
     * - z: 0 ~ 90
     * @param eulerAngles
     */
    setLightDirection(eulerAngles: Vec3): void;
    /**
     * Setup the background color e.g. `settings.setColorBackground(new cc.Color(r, g, b, a));`
     * @param [color] The `cc.Color` object, RGBA value is from 0 - 255
     */
    setColorBackground(color?: Color): void;
    /**
     * Activate the sky box
     */
    setEnvironment(): void;
    /**
     * Setup environment setups including sky box, ambient, shadows and post processes for blank material
     * @param enabled
     */
    setBlankScene(enabled: boolean): void;
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
    private loadSample;
}
/**
 * The settings menu of the model viewer, including setup UI for
 * - Environment: Sky box or color background
 * - Materials: PBR, Toon, Shaded, Blank
 * - PostProcesses: Bloom, Ambient Occlusion, Vignette
 */
export declare class SettingsMenu extends Component {
    /**
     * The json asset containing the Rodin assets preset
     * No need to use it for remote assets
     */
    assets: JsonAsset;
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
     * @param frame The frame element that the mouse event should be relative to, default is the canvas element
     */
    public windowMouseMove (e: MouseEvent): void;

    /**
     * End controlling the camera, if the mouse move event is listened in the outer window, this method should be called manually.
     */
    public onMouseUp (): void;
}
