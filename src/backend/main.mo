import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type FeatureRequestId = Nat;
  type FeatureRequest = {
    id : FeatureRequestId;
    message : Text;
    email : ?Text;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
  };

  type AnnouncementId = Nat;
  type Announcement = {
    id : AnnouncementId;
    message : Text;
    timestamp : Time.Time;
  };

  type AssignmentId = Nat;
  type Assignment = {
    id : AssignmentId;
    topic : Text;
    level : Text;
    length : Text;
    language : Text;
    content : Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  type AssignmentParams = {
    topic : Text;
    level : Text;
    length : Text;
    language : Text;
  };

  type ConversationEntry = {
    question : Text;
    answer : Text;
    timestamp : Time.Time;
  };

  type OptionalTime = {
    hour : Nat;
    minute : Nat;
  };

  public type StudyTaskPublic = {
    id : Nat;
    subject : Text;
    topic : Text;
    duration : Text;
    priority : ?Text;
    isCompleted : Bool;
    viewType : ?StudyPlannerView;
    subjectColor : ?Text;
    created : Time.Time;
    date : ?Time.Time;
    time : ?OptionalTime;
  };

  type StudyTask = {
    id : Nat;
    subject : Text;
    topic : Text;
    duration : Text;
    priority : ?Text;
    isCompleted : Bool;
    viewType : ?StudyPlannerView;
    subjectColor : ?Text;
    created : Time.Time;
    date : ?Time.Time;
    time : ?OptionalTime;
  };

  type StudyPlannerView = {
    #daily;
    #weekly;
  };

  public type AssignmentGenerationResult = {
    params : AssignmentParams;
    needsConfirmation : Bool;
  };

  var nextFeatureRequestId = 0;
  let featureRequests = Map.empty<FeatureRequestId, FeatureRequest>();

  public shared ({ caller }) func submitFeatureRequest(message : Text, email : ?Text) : async () {
    // No authorization check - any user including guests can submit feature requests
    let id = nextFeatureRequestId;
    nextFeatureRequestId += 1;

    let request : FeatureRequest = {
      id;
      message;
      email;
      timestamp = Time.now();
    };

    featureRequests.add(id, request);
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  var nextAnnouncementId = 0;
  let announcements = Map.empty<AnnouncementId, Announcement>();

  public shared ({ caller }) func createAnnouncement(message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create announcements");
    };
    let id = nextAnnouncementId;
    nextAnnouncementId += 1;

    let announcement : Announcement = {
      id;
      message;
      timestamp = Time.now();
    };

    announcements.add(id, announcement);
  };

  public query ({ caller }) func getAllAnnouncements() : async [Announcement] {
    // No authorization check - any user including guests can view announcements
    announcements.values().toArray();
  };

  public shared ({ caller }) func deleteAnnouncement(id : AnnouncementId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };
    if (not announcements.containsKey(id)) {
      Runtime.trap("Announcement not found");
    };
    announcements.remove(id);
  };

  type UserRolePublicFacing = {
    #admin;
    #user;
    #guest;
  };

  var nextAssignmentId = 0;
  let assignments = Map.empty<AssignmentId, Assignment>();
  let conversationHistory = Map.empty<Principal, List.List<ConversationEntry>>();
  var lastRequestedAssignmentParams : ?AssignmentParams = null;

  func extractTopicOnly(input : Text) : Text {
    let nonTopicKeywords = [
      "mujhe",
      "bana do",
      "assignment likho",
      "likhne",
      "assignment kar do",
      "do",
      "assignment",
      "likh do",
      "assignment likh do",
      "bana do",
      "write assignment",
      "complete assignment",
      "assignment complete",
      "assignment kar do",
      "project kar do",
      "project complete",
      "project complete kar do",
      "make project",
      "assignment likh do bijli par",
      "assignment likhne ki machine",
      "bana kar do",
      "per bana kar",
      "assignment bana do",
    ];

    var topic = input.trim(#char ' ');
    for (keyword in nonTopicKeywords.values()) {
      if (topic.startsWith(#text keyword)) {
        topic := topic.replace(#text keyword, "");
      };
      if (topic.contains(#text keyword)) {
        topic := topic.replace(#text keyword, "");
      };
    };

    topic.trim(#char ' ');
  };

  func createAssignmentParams(topic : Text, level : Text, length : Text, language : Text) : AssignmentParams {
    {
      topic;
      level;
      length;
      language;
    };
  };

  public shared ({ caller }) func saveConversationEntry(question : Text, answer : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save conversation history");
    };
    let entry : ConversationEntry = {
      question;
      answer;
      timestamp = Time.now();
    };

    let existingHistory = switch (conversationHistory.get(caller)) {
      case (null) { List.empty<ConversationEntry>() };
      case (?history) { history };
    };
    existingHistory.add(entry);
    conversationHistory.add(caller, existingHistory);
  };

  public shared ({ caller }) func createAssignment(
    topic : Text,
    level : Text,
    length : Text,
    language : Text,
    content : Storage.ExternalBlob,
  ) : async Assignment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create assignments");
    };

    let id = nextAssignmentId;
    nextAssignmentId += 1;

    let assignment : Assignment = {
      id;
      topic;
      level;
      length;
      language;
      content;
      timestamp = Time.now();
    };

    assignments.add(id, assignment);
    assignment;
  };

  public query ({ caller }) func getAssignment(id : AssignmentId) : async ?Assignment {
    // No authorization check - any user including guests can view assignments
    assignments.get(id);
  };

  public query ({ caller }) func getAllAssignments() : async [Assignment] {
    // No authorization check - any user including guests can view assignments
    assignments.values().toArray();
  };

  // STUDY PLANNER TOOL
  var nextTaskId = 0;

  // Store view preference per user
  let userViewPreferences = Map.empty<Principal, StudyPlannerView>();

  // Store tasks per user
  let userTasks = Map.empty<Principal, List.List<StudyTask>>();

  public shared ({ caller }) func setView(view : StudyPlannerView) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set view preferences");
    };
    userViewPreferences.add(caller, view);
  };

  public shared ({ caller }) func addTask(
    subject : Text,
    topic : Text,
    duration : Text,
    priority : ?Text,
    viewType : ?StudyPlannerView,
    subjectColor : ?Text,
    date : ?Time.Time,
    time : ?OptionalTime,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add tasks");
    };
    validateTaskFields(subject, topic, duration);

    let newTask : StudyTask = {
      id = nextTaskId;
      subject;
      topic;
      duration;
      priority;
      isCompleted = false;
      viewType;
      subjectColor;
      created = Time.now();
      date;
      time;
    };

    let existingTasks = switch (userTasks.get(caller)) {
      case (null) { List.empty<StudyTask>() };
      case (?tasks) { tasks };
    };
    existingTasks.add(newTask);
    userTasks.add(caller, existingTasks);

    nextTaskId += 1;
  };

  func validateTaskFields(subject : Text, topic : Text, duration : Text) {
    if (subject.isEmpty() or topic.isEmpty() or duration.isEmpty()) {
      Runtime.trap("All fields are required. Please complete all fields before adding a task.");
    };
  };

  public shared ({ caller }) func toggleTaskCompletion(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle task completion");
    };
    let existingTasks = switch (userTasks.get(caller)) {
      case (null) { Runtime.trap("No tasks found for this user") };
      case (?tasks) { tasks };
    };

    var taskFound = false;
    let updatedTasks = existingTasks.map<StudyTask, StudyTask>(
      func(task) {
        if (task.id == taskId) {
          taskFound := true;
          { task with isCompleted = not task.isCompleted };
        } else { task };
      }
    );

    if (not taskFound) {
      Runtime.trap("Task not found");
    };

    userTasks.add(caller, updatedTasks);
  };

  public query ({ caller }) func getTaskCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get task count");
    };
    switch (userTasks.get(caller)) {
      case (null) { 0 };
      case (?tasks) { tasks.size() };
    };
  };

  public shared ({ caller }) func deleteTask(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete tasks");
    };
    let existingTasks = switch (userTasks.get(caller)) {
      case (null) { Runtime.trap("No tasks found for this user") };
      case (?tasks) { tasks };
    };

    let filteredTasks = existingTasks.filter(
      func(task) {
        task.id != taskId;
      }
    );

    userTasks.add(caller, filteredTasks);
  };

  public shared ({ caller }) func undoLastTask() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can undo tasks");
    };
    let existingTasks = switch (userTasks.get(caller)) {
      case (null) { Runtime.trap("No tasks found for this user") };
      case (?tasks) { tasks };
    };
    if (existingTasks.isEmpty()) {
      Runtime.trap("No tasks to undo");
    };

    let reversedTasks = existingTasks.reverse();
    let reversedArray = reversedTasks.toArray();
    if (reversedArray.size() > 1) {
      let withoutLast = List.empty<StudyTask>();
      var currentIndex = 0;
      for (task in reversedArray.values()) {
        if (currentIndex > 0) {
          withoutLast.add(task);
        };
        currentIndex += 1;
      };
      if (withoutLast.isEmpty()) {
        userTasks.remove(caller);
      } else {
        userTasks.add(caller, withoutLast.reverse());
      };
    };
  };

  public shared ({ caller }) func dragDropReorder(newOrder : [Nat]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reorder tasks");
    };
    let existingTasks = switch (userTasks.get(caller)) {
      case (null) { Runtime.trap("No tasks found for this user") };
      case (?tasks) {
        if (tasks.isEmpty()) {
          Runtime.trap("No tasks to reorder");
        };
        tasks;
      };
    };

    let tasksArray = existingTasks.toArray();
    if (tasksArray.isEmpty()) {
      Runtime.trap("No tasks to reorder");
    };

    let reorderedTasks = List.empty<StudyTask>();

    for (taskId in newOrder.values()) {
      var foundTaskIndex : ?Nat = null;
      var index = 0;
      while (index < tasksArray.size()) {
        if (tasksArray[index].id == taskId and foundTaskIndex == null) {
          foundTaskIndex := ?index;
        };
        index += 1;
      };
      switch (foundTaskIndex) {
        case (?index) {
          reorderedTasks.add(tasksArray[index]);
        };
        case (null) {};
      };
    };

    if (reorderedTasks.isEmpty()) {
      Runtime.trap("Error: Reordered tasks are empty");
    };

    userTasks.add(caller, reorderedTasks);
  };

  public shared ({ caller }) func updateTask(
    id : Nat,
    subject : Text,
    topic : Text,
    duration : Text,
    priority : ?Text,
    viewType : ?StudyPlannerView,
    subjectColor : ?Text,
    date : ?Time.Time,
    time : ?OptionalTime,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update tasks");
    };
    validateTaskFields(subject, topic, duration);

    switch (userTasks.get(caller)) {
      case (null) { Runtime.trap("No tasks found for the user") };
      case (?existingTasks) {
        var found = false;
        var i = 0;
        let taskArray = existingTasks.toArray();
        let taskArraySize = taskArray.size();
        while (i < taskArraySize and not found) {
          if (taskArray[i].id == id) {
            found := true;
          };
          i += 1;
        };
        if (not found) {
          Runtime.trap("Task to update not found");
        };

        var oldIsCompleted = false;
        for (oldTask in existingTasks.values()) {
          if (oldTask.id == id) {
            oldIsCompleted := oldTask.isCompleted;
          };
        };

        let updatedTask : StudyTask = {
          id;
          subject;
          topic;
          duration;
          priority;
          isCompleted = oldIsCompleted;
          viewType;
          subjectColor;
          created = Time.now();
          date;
          time;
        };

        let taskArrayEntries = existingTasks.toArray();

        if (taskArrayEntries.isEmpty()) {
          Runtime.trap("Unexpected error: Task array is empty");
        };

        let finalTasks = List.empty<StudyTask>();
        var idx = 0;
        let taskArrayEntriesSize = taskArrayEntries.size();
        while (idx < taskArrayEntriesSize) {
          let task = taskArrayEntries[idx];
          if (task.id == updatedTask.id) {
            finalTasks.add(updatedTask);
          } else {
            finalTasks.add(task);
          };
          idx += 1;
        };

        if (finalTasks.isEmpty()) {
          Runtime.trap("Unexpected error: Could not find task to replace");
        };

        userTasks.add(caller, finalTasks);
      };
    };
  };

  public query ({ caller }) func getTasks() : async [StudyTaskPublic] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get tasks");
    };
    switch (userTasks.get(caller)) {
      case (null) { [] };
      case (?tasks) {
        tasks.map<StudyTask, StudyTaskPublic>(
          func(task) {
            {
              id = task.id;
              subject = task.subject;
              topic = task.topic;
              duration = task.duration;
              priority = task.priority;
              isCompleted = task.isCompleted;
              viewType = task.viewType;
              subjectColor = task.subjectColor;
              created = task.created;
              date = task.date;
              time = task.time;
            };
          }
        ).toArray();
      };
    };
  };

  public query ({ caller }) func getFilteredTasks(view : ?StudyPlannerView) : async [StudyTaskPublic] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get filtered tasks");
    };
    switch (userTasks.get(caller)) {
      case (null) { [] };
      case (?tasks) {
        let filteredTasks = switch (view) {
          case (null) { tasks };
          case (?v) {
            tasks.filter(
              func(task) {
                switch (task.viewType) {
                  case (null) { true };
                  case (?vt) { vt == v };
                };
              }
            );
          };
        };

        filteredTasks.map<StudyTask, StudyTaskPublic>(
          func(task) {
            {
              id = task.id;
              subject = task.subject;
              topic = task.topic;
              duration = task.duration;
              priority = task.priority;
              isCompleted = task.isCompleted;
              viewType = task.viewType;
              subjectColor = task.subjectColor;
              created = task.created;
              date = task.date;
              time = task.time;
            };
          }
        ).toArray();
      };
    };
  };
};
