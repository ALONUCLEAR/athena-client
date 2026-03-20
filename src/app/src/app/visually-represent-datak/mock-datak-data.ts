//#region types - these will eventually be in mnp/cfg

interface NamedEntity<T = string> {
    id: string;
    name: T;
}

// we can think of a better name - is only an enum if there's a (small) fixed number of caps in a shelter
export enum CapPlacement {
    ONE = "ONE",
    TWO = "TWO",
    THREE = "THREE",
    FOUR = "FOUR",
    FRONT = "FRONT",
    REAR = "REAR"
};

export interface CapAndShelterData {
    shelter: NamedEntity,
    cap: NamedEntity & { placement: CapPlacement }
};

export interface MiniPlane {
    tailNum: number;
    capAndShelterData?: CapAndShelterData;
}

export interface TimeData {
    takeoff?: Date;
    weirdMiddleThing?: Date;
    lending?: Date;
}

export interface CrewmanInCrew {
    name: string;
}

export interface BasePlaneInStructure {
    id?: string;
    plane?: MiniPlane;
    galileoPlane?: MiniPlane;
    crew: CrewmanInCrew[]; 
}

// for convinience, the fake plane in structures contain data that should be on the structure(so I don't have to make a structure)
export interface NonReadinessPlaneInStructure extends BasePlaneInStructure {
    type: 'training' | 'operational' | 'simulation';
    timeData?: TimeData;
}

export interface ReadinessPlaneInStructure extends BasePlaneInStructure {
    type: 'readiness';
    readinessData?: {
        readinessMinutes?: number;
    }
}

export type PlaneInStructure = NonReadinessPlaneInStructure | ReadinessPlaneInStructure;

//#endregion

const mockDatak: NamedEntity = { id: '9', name: '9' };

const mockMiniPlanes: MiniPlane[] = [
    { tailNum: 550, capAndShelterData: { shelter: mockDatak, cap: { id: '1', name: '1', placement: CapPlacement.ONE } } },
    { tailNum: 341, capAndShelterData: { shelter: mockDatak, cap: { id: '2', name: '2', placement: CapPlacement.TWO } } },
    { tailNum: 111, capAndShelterData: { shelter: mockDatak, cap: { id: '3', name: '3', placement: CapPlacement.THREE } } },
    { tailNum: 228, capAndShelterData: { shelter: mockDatak, cap: { id: '4', name: '4', placement: CapPlacement.FOUR } } },
    { tailNum: 903, capAndShelterData: { shelter: mockDatak, cap: { id: 'f', name: 'קדמי', placement: CapPlacement.FRONT } } },
    { tailNum: 551, capAndShelterData: { shelter: mockDatak, cap: { id: 'r', name: 'אחורי', placement: CapPlacement.REAR } } },
];

const timeDatas: TimeData[] = [
    { takeoff: new Date(2026, 1, 28, 11, 0), weirdMiddleThing: new Date(2026, 1, 28, 11, 45), lending: new Date(2026, 1, 28, 12, 0) },
    { takeoff: new Date(2026, 1, 28, 12, 0), weirdMiddleThing: new Date(2026, 1, 28, 12, 45), lending: new Date(2026, 1, 28, 13, 0) },
    { takeoff: new Date(2026, 1, 28, 12, 30), weirdMiddleThing: new Date(2026, 1, 28, 13, 15), lending: new Date(2026, 1, 28, 13, 30) },
    { takeoff: new Date(2026, 1, 28, 11, 0), weirdMiddleThing: new Date(2026, 1, 28, 11, 45), lending: new Date(2026, 1, 28, 12, 0) },
    { takeoff: new Date(2026, 1, 28, 9, 0), weirdMiddleThing: new Date(2026, 1, 28, 9, 45), lending: new Date(2026, 1, 28, 10, 0) },
    { takeoff: new Date(2026, 1, 28, 11, 0), weirdMiddleThing: new Date(2026, 1, 28, 10, 45), lending: new Date(2026, 1, 28, 11, 0) },
]

export const mockPlanesInStructrue: PlaneInStructure[] = [
    { id:'1', type: 'training', crew: [{ name: 'יורם' }, { name: 'רפאל' }], galileoPlane: mockMiniPlanes[0], timeData: timeDatas[0] },
    { id:'2', type: 'training', crew: [{ name: 'רמי' }, { name: 'פוקהונטס' }], plane: mockMiniPlanes[1], timeData: timeDatas[1] },
    { id:'3', type: 'simulation', crew: [{ name: 'רונה' }, { name: 'אליהו' }], galileoPlane: mockMiniPlanes[2], timeData: timeDatas[2] },
    { id:'4', type: 'readiness', crew: [{ name: 'אוהד' }, { name: 'אדם' }], galileoPlane: mockMiniPlanes[3], readinessData: { readinessMinutes: 240 } },
    { id:'5', type: 'operational', crew: [{ name: 'איתי' }, { name: 'עופר' }], galileoPlane: mockMiniPlanes[4], timeData: timeDatas[4] },
    { id:'6', type: 'operational', crew: [{ name: 'חן' }, { name: 'דניאל' }], plane: mockMiniPlanes[5], timeData: timeDatas[5] },
];