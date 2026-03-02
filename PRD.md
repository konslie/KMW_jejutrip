# PRD: Jeju Trip Planner (Trip Planner Engine)

## 1. Project Overview (What & Why)
A web-based trip planner application designed to dynamically load, display, and manage travel itineraries based on modular configuration files (JSON). It helps users view daily schedules, interact with maps, and store changes securely via Firebase.

## 2. Core Requirements
- **Dynamic Data Loading**: Itinerary data is managed via separate JSON configuration files.
- **Dynamic UI**: UI components (title, day filters, schedule lists) render automatically based on the chosen JSON configuration.
- **Firebase Integration**: Database connections adapt dynamically according to the loaded trip configuration.
- **Map & Schedule Interaction**: Visualize spots on the map, view daily schedules, and manage specific tasks related to the trip.

## 3. Key Design Principles (Karpathy Guidelines)
- **Simplicity First**: Minimum code needed to solve the problem.
- **No Speculative Features**: Built strictly to requirements. No hidden admin modes unless explicitly agreed upon.
