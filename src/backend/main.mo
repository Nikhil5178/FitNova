import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Data Types
  public type WorkoutType = {
    #strength;
    #cardio;
    #yoga;
    #other;
  };

  public type MealType = {
    #breakfast;
    #lunch;
    #dinner;
    #snack;
  };

  public type Goal = {
    name : Text;
    targetValue : Nat;
    currentValue : Nat;
    unit : Text;
  };

  public type Workout = {
    workoutType : WorkoutType;
    duration : Nat;
    caloriesBurned : Nat;
    date : Int;
  };

  public type StepCount = {
    date : Int;
    steps : Nat;
  };

  public type Meal = {
    name : Text;
    calories : Nat;
    protein : Nat;
    carbs : Nat;
    fat : Nat;
    mealType : MealType;
    date : Int;
  };

  public type UserProfile = {
    name : Text;
    age : Nat;
    weight : Nat;
    height : Nat;
    fitnessGoals : [Goal];
  };

  public type ChatMessage = {
    role : Text;
    content : Text;
  };

  // Keep authorization state to preserve stable variable compatibility
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let workouts = Map.empty<Principal, List.List<Workout>>();
  let stepCounts = Map.empty<Principal, List.List<StepCount>>();
  let meals = Map.empty<Principal, List.List<Meal>>();
  let goals = Map.empty<Principal, List.List<Goal>>();
  let chatHistories = Map.empty<Principal, List.List<ChatMessage>>();

  // Profile Management
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  // Workout Logging
  public shared ({ caller }) func logWorkout(workout : Workout) : async () {
    let userWorkouts = switch (workouts.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<Workout>() };
    };
    userWorkouts.add(workout);
    workouts.add(caller, userWorkouts);
  };

  public query ({ caller }) func getWorkouts() : async [Workout] {
    switch (workouts.get(caller)) {
      case (?userWorkouts) { userWorkouts.toArray() };
      case (null) { [] };
    };
  };

  // Step Count Tracking
  public shared ({ caller }) func logStepCount(stepCount : StepCount) : async () {
    let userSteps = switch (stepCounts.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<StepCount>() };
    };
    userSteps.add(stepCount);
    stepCounts.add(caller, userSteps);
  };

  public query ({ caller }) func getStepCounts() : async [StepCount] {
    switch (stepCounts.get(caller)) {
      case (?userSteps) { userSteps.toArray() };
      case (null) { [] };
    };
  };

  // Nutrition/Meal Logging
  public shared ({ caller }) func logMeal(meal : Meal) : async () {
    let userMeals = switch (meals.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<Meal>() };
    };
    userMeals.add(meal);
    meals.add(caller, userMeals);
  };

  public query ({ caller }) func getMeals() : async [Meal] {
    switch (meals.get(caller)) {
      case (?userMeals) { userMeals.toArray() };
      case (null) { [] };
    };
  };

  // Goal Tracking
  public shared ({ caller }) func saveGoal(goal : Goal) : async () {
    let userGoals = switch (goals.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<Goal>() };
    };
    userGoals.add(goal);
    goals.add(caller, userGoals);
  };

  public query ({ caller }) func getGoals() : async [Goal] {
    switch (goals.get(caller)) {
      case (?userGoals) { userGoals.toArray() };
      case (null) { [] };
    };
  };

  // Chat History
  public shared ({ caller }) func addChatMessage(message : ChatMessage) : async () {
    let userChats = switch (chatHistories.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<ChatMessage>() };
    };
    userChats.add(message);
    chatHistories.add(caller, userChats);
  };

  public query ({ caller }) func getChatHistory() : async [ChatMessage] {
    switch (chatHistories.get(caller)) {
      case (?userChats) { userChats.toArray() };
      case (null) { [] };
    };
  };
};
