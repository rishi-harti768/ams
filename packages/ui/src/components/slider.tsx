import { cn } from "@ams/ui/lib/utils";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	...props
}: SliderPrimitive.Root.Props) {
	// Determine thumb count based on value or defaultValue array length
	let thumbCount = 1;
	if (Array.isArray(value)) {
		thumbCount = value.length;
	} else if (Array.isArray(defaultValue)) {
		thumbCount = defaultValue.length;
	}

	return (
		<SliderPrimitive.Root
			className={cn(
				"relative flex touch-none select-none items-center",
				"data-horizontal:h-5 data-horizontal:w-full",
				"data-vertical:h-full data-vertical:w-5 data-vertical:flex-col",
				className
			)}
			data-slot="slider"
			defaultValue={defaultValue}
			max={max}
			min={min}
			thumbAlignment="edge"
			value={value}
			{...props}
		>
			<SliderPrimitive.Control className="relative flex w-full grow items-center data-vertical:h-full data-vertical:flex-col data-disabled:opacity-50">
				<SliderPrimitive.Track
					className="relative grow overflow-hidden rounded-full bg-slate-200 data-horizontal:h-1.5 data-vertical:h-full data-horizontal:w-full data-vertical:w-1.5"
					data-slot="slider-track"
				>
					<SliderPrimitive.Indicator
						className="bg-primary data-horizontal:h-full data-vertical:w-full"
						data-slot="slider-range"
					/>
				</SliderPrimitive.Track>
				{Array.from({ length: thumbCount }, (_, index) => (
					<SliderPrimitive.Thumb
						className={cn(
							"block size-5 rounded-full border-2 border-primary bg-white shadow-md transition-all",
							"hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
							"active:scale-95 active:shadow-sm disabled:pointer-events-none disabled:opacity-50"
						)}
						data-slot="slider-thumb"
						key={index}
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };
